"""Pro-3: deterministic skill health + Hermes-fit scoring (pure functions).

`score_skill` takes normalized metadata and returns a transparent, explainable
0-100 score with per-dimension breakdown, hard blockers, and an install
recommendation. No I/O — the dashboard endpoint gathers the inputs and calls in.

Dimensions (weights): Trust 25 · Completeness 20 · Hermes-fit 30 · Maintenance 15
· Safety 10. When run history is supplied, a real-world reliability adjustment
is folded in (a skill that actually runs green scores higher; one that keeps
failing is penalised and flagged).
"""

from __future__ import annotations

import time
from typing import Any


def _grade(score: int) -> str:
    if score >= 85:
        return "A"
    if score >= 70:
        return "B"
    if score >= 50:
        return "C"
    return "D"


def _num(value: Any) -> float:
    """Coerce possibly-string/None metadata numbers to a float; 0 on garbage."""
    if value is None:
        return 0.0
    try:
        return float(value)
    except (TypeError, ValueError):
        try:
            return float(str(value).replace(",", "").strip())
        except (TypeError, ValueError):
            return 0.0


def infer_capabilities(meta: dict) -> list[str]:
    """Best-effort capability tags (what the skill can touch) for the Safety view (J)."""
    caps = meta.get("capabilities")
    if isinstance(caps, list) and caps:
        return [str(c) for c in caps]
    out: list[str] = []
    if meta.get("requires_api_key") or meta.get("requires_env"):
        out.append("network")
    bins = [str(b).lower() for b in (meta.get("requires_bins") or [])]
    if any(b in ("docker", "bash", "sh", "powershell", "node", "python") for b in bins):
        out.append("exec")
    if any(b in ("git", "curl", "wget") for b in bins):
        out.append("network")
    # skills almost always read/write files in their workspace
    out.append("filesystem")
    # de-dupe, stable order
    seen: list[str] = []
    for c in out:
        if c not in seen:
            seen.append(c)
    return seen


def score_skill(meta: dict, *, installed_bins: set | None = None,
                runs_summary: dict | None = None) -> dict:
    """Return {score, grade, recommendation, dimensions, blockers, capabilities}."""
    installed_bins = installed_bins or set()
    dims: list[dict] = []
    blockers: list[str] = []

    # --- Trust (25) ---
    tscore = 0
    treasons = []
    if meta.get("verified"):
        tscore += 12
        treasons.append("已验证发布者")
    elif meta.get("moderation_clean"):
        tscore += 7
        treasons.append("已通过官方安全审核")
    dl_raw = meta.get("downloads")
    st_raw = meta.get("stars")
    adoption_known = (dl_raw is not None) or (st_raw is not None)
    dl = _num(dl_raw)
    st = _num(st_raw)
    if dl >= 1000 or st >= 50:
        tscore += 9
        treasons.append("社区采用度高")
    elif dl >= 100 or st >= 10:
        tscore += 5
        treasons.append("有一定采用度")
    elif not adoption_known:
        # Absence of data is not evidence of low quality — credit neutrally
        # rather than punishing skills on markets that don't expose counts.
        tscore += 4
        treasons.append("采用度数据未公开")
    else:
        treasons.append("采用度偏低")
    if meta.get("source"):
        tscore += 4
    dims.append({"name": "可信度", "score": min(tscore, 25), "max": 25, "reasons": treasons})

    # --- Completeness (20) ---
    cscore = 0
    creasons = []
    if meta.get("has_skill_md"):
        cscore += 10
        creasons.append("含 SKILL.md")
    else:
        creasons.append("缺少 SKILL.md")
    desc = (meta.get("description") or "").strip()
    if len(desc) >= 40:
        cscore += 6
        creasons.append("描述完整")
    elif desc:
        cscore += 3
        creasons.append("描述简短")
    else:
        creasons.append("无描述")
    if meta.get("version"):
        cscore += 4
        creasons.append("有版本号")
    dims.append({"name": "完整性", "score": min(cscore, 20), "max": 20, "reasons": creasons})

    # --- Hermes-fit (30) ---
    fscore = 18  # baseline: all skills run through deterministic structured-JSON tools
    freasons = ["走确定性结构化 JSON 工具"]
    req_bins = [str(b) for b in (meta.get("requires_bins") or [])]
    missing = [b for b in req_bins if b not in installed_bins] if req_bins else []
    if not req_bins:
        fscore += 8
        freasons.append("无额外命令行依赖")
    elif not missing:
        fscore += 8
        freasons.append("依赖均已就绪")
    else:
        freasons.append("缺少依赖：" + ", ".join(missing))
        blockers.append("缺少命令行依赖：" + ", ".join(missing))
    lic = (meta.get("license") or "").lower()
    if any(k in lic for k in ("mit", "apache", "bsd", "isc")):
        fscore += 4
        freasons.append("许可证宽松")
    elif lic:
        fscore += 2
    dims.append({"name": "Hermes 兼容性", "score": min(fscore, 30), "max": 30, "reasons": freasons})

    # --- Maintenance (15) ---
    mscore = 0
    mreasons = []
    upd = meta.get("updated_at")
    ts = None
    if isinstance(upd, (int, float)):
        ts = float(upd)
    elif isinstance(upd, str) and upd.strip():
        u = upd.strip()
        try:
            ts = float(u)  # epoch seconds as string
        except ValueError:
            try:
                import datetime as _dt

                ts = _dt.datetime.fromisoformat(u.replace("Z", "+00:00")).timestamp()
            except Exception:
                ts = None
    if ts:
        age_days = (time.time() - ts) / 86400.0
        if age_days <= 90:
            mscore += 12
            mreasons.append("近 3 个月有更新")
        elif age_days <= 365:
            mscore += 7
            mreasons.append("一年内有更新")
        else:
            mscore += 2
            mreasons.append("超过一年未更新")
    else:
        mscore += 5
        mreasons.append("更新时间未知")
    if meta.get("version"):
        mscore += 3
        mreasons.append("版本可锁定")
    dims.append({"name": "维护度", "score": min(mscore, 15), "max": 15, "reasons": mreasons})

    # --- Safety (10) ---
    sscore = 10
    sreasons = []
    caps = infer_capabilities(meta)
    if "exec" in caps and "network" in caps:
        sscore -= 3
        sreasons.append("可执行命令且联网（注意授权）")
    if meta.get("requires_api_key"):
        sreasons.append("需 API Key（如实声明）")
    if not sreasons:
        sreasons.append("无明显风险信号")
    dims.append({"name": "安全", "score": max(sscore, 0), "max": 10, "reasons": sreasons})

    base = sum(d["score"] for d in dims)

    # --- Real-world reliability (from Pro-1 run history) ---
    reliability = None
    if runs_summary and runs_summary.get("total"):
        total = int(runs_summary["total"])
        sr = runs_summary.get("success_rate")
        sr = float(sr) if sr is not None else None
        if sr is not None:
            if sr >= 0.9:
                base = min(100, base + 5)
                rel_note = "实测可靠（成功率 %d%%）" % round(sr * 100)
            elif sr >= 0.6:
                rel_note = "实测一般（成功率 %d%%）" % round(sr * 100)
            else:
                base = max(0, base - 8)
                rel_note = "实测不稳定（成功率 %d%%，近 %d 次）" % (round(sr * 100), total)
                blockers.append(rel_note)
            reliability = {"total": total, "success_rate": sr, "note": rel_note}

    score = max(0, min(100, int(round(base))))
    grade = _grade(score)
    if blockers:
        recommendation = "caution"
    elif score >= 75:
        recommendation = "recommended"
    elif score >= 50:
        recommendation = "caution"
    else:
        recommendation = "not_recommended"

    return {
        "score": score,
        "grade": grade,
        "recommendation": recommendation,
        "dimensions": dims,
        "blockers": blockers,
        "capabilities": caps,
        "reliability": reliability,
    }
