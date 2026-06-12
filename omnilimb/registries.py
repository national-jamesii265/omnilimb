"""Skill-market registry adapters (multi-market support).

A Registry abstracts a skills marketplace so the native backend can install from
different sources with one code path. Two adapters ship:

- ClawHubRegistry  -> clawhub.ai, the official OpenClaw registry (HTTP API v1).
- SkillHubRegistry -> api.skillhub.cn, a China-focused skills market (public
  read API: GET /api/skills, GET /api/v1/download?slug= -> 302 -> zip).

Selected via config `market` (clawhub | skillhub) or env OMNILIMB_MARKET.

Each adapter returns plain dicts; the native backend owns extraction, zip-slip
protection, and provenance writing.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from .config import get_settings


# --------------------------------------------------------------------------- #
# HTTP helpers (plain, stdlib only)
# --------------------------------------------------------------------------- #
def _request(url: str, *, accept: str, token_env: str | None = None):
    req = urllib.request.Request(url, headers={"Accept": accept})
    if token_env:
        tok = os.environ.get(token_env)
        if tok:
            req.add_header("Authorization", f"Bearer {tok}")
    return req


def http_json(url: str, *, token_env: str | None = None, timeout: int = 20) -> dict[str, Any]:
    try:
        with urllib.request.urlopen(_request(url, accept="application/json", token_env=token_env), timeout=timeout) as r:  # noqa: S310
            return {"ok": True, "data": json.loads(r.read().decode("utf-8"))}
    except urllib.error.HTTPError as exc:
        body = ""
        try:
            body = exc.read().decode("utf-8", "replace")[:200]
        except Exception:
            pass
        return {"ok": False, "error": f"HTTP {exc.code}: {body or exc.reason}",
                "status": exc.code, "retryable": exc.code in (429, 500, 502, 503, 504)}
    except Exception as exc:
        return {"ok": False, "error": f"unreachable: {exc}", "retryable": True}


def http_bytes(url: str, *, token_env: str | None = None, timeout: int = 90) -> dict[str, Any]:
    try:
        with urllib.request.urlopen(_request(url, accept="application/zip,*/*", token_env=token_env), timeout=timeout) as r:  # noqa: S310
            return {"ok": True, "bytes": r.read()}
    except urllib.error.HTTPError as exc:
        return {"ok": False, "error": f"download HTTP {exc.code}: {exc.reason}",
                "status": exc.code, "retryable": exc.code in (429, 500, 502, 503, 504)}
    except Exception as exc:
        return {"ok": False, "error": f"download failed: {exc}", "retryable": True}


# --------------------------------------------------------------------------- #
# Registry adapters
# --------------------------------------------------------------------------- #
_SORT_KEYS = {"downloads": "downloads", "installs": "installs", "stars": "stars", "latest": "updated_at"}


def sort_skills(skills: list[dict], sort: str | None) -> list[dict]:
    """Client-side sort (markets don't all support server-side sort)."""
    if not sort or sort == "relevance":
        return skills
    key = _SORT_KEYS.get(sort)
    if not key:
        return skills
    return sorted(skills, key=lambda s: (s.get(key) or 0), reverse=True)


class Registry:
    id = "base"

    def base(self) -> str:  # pragma: no cover - abstract
        raise NotImplementedError

    def search(self, query: str, limit: int, *, page: int = 1,
               category: str | None = None, sort: str | None = None) -> dict[str, Any]: ...
    def resolve(self, slug: str) -> dict[str, Any]: ...
    def download(self, slug: str, version: str | None) -> dict[str, Any]: ...
    def verify(self, slug: str, version: str | None) -> dict[str, Any] | None:
        return None

    def list_categories(self) -> list[str]:
        return []

    def skill_url(self, slug: str, owner: str | None = None) -> str:
        return f"{self.base().rstrip('/')}/{(owner + '/') if owner else ''}{slug}"


class ClawHubRegistry(Registry):
    """clawhub.ai — OpenClaw official registry (HTTP API v1)."""

    id = "clawhub"

    def __init__(self, base_url: str | None = None, rid: str | None = None):
        self._base = (base_url or "").rstrip("/") or None
        if rid:
            self.id = rid

    def base(self) -> str:
        return (self._base or get_settings().registry_base_url).rstrip("/")

    def search(self, query: str, limit: int, *, page: int = 1,
               category: str | None = None, sort: str | None = None) -> dict[str, Any]:
        if not query:
            # Browse/discover: ClawHub's /search needs a keyword, so list via the
            # skills listing endpoint which supports sort=downloads|stars|trending|newest.
            return self._browse(limit, sort)
        url = f"{self.base()}/api/v1/search?" + urllib.parse.urlencode(
            {"q": query, "limit": limit, "nonSuspiciousOnly": "true"}
        )
        res = http_json(url, token_env="CLAWHUB_TOKEN")
        if not res["ok"]:
            return res
        results = (res["data"] or {}).get("results", [])
        skills = [
            {
                "slug": r.get("slug"),
                "displayName": r.get("displayName"),
                "summary": r.get("summary"),
                "version": r.get("version"),
                "owner": r.get("ownerHandle") or (r.get("owner") or {}).get("handle"),
                "score": r.get("score"),
                "verified": bool(r.get("verified")) if r.get("verified") is not None else None,
                "downloads": r.get("downloads") or r.get("installs"),
                "category": r.get("category"),
                "source": self.id,
                "url": self.skill_url(r.get("slug", ""), r.get("ownerHandle")),
            }
            for r in results
        ]
        skills = sort_skills(skills, sort)
        return {"ok": True, "skills": skills, "total": len(skills)}

    def _browse(self, limit: int, sort: str | None) -> dict[str, Any]:
        smap = {"downloads": "downloads", "stars": "stars", "latest": "newest",
                "newest": "newest", "relevance": "trending", "": "trending"}
        so = smap.get(sort or "", "trending")
        url = f"{self.base()}/api/v1/skills?" + urllib.parse.urlencode(
            {"limit": max(1, min(int(limit), 50)), "sort": so}
        )
        res = http_json(url, token_env="CLAWHUB_TOKEN")
        if not res["ok"]:
            return res
        items = (res["data"] or {}).get("items", [])
        skills = []
        for it in items:
            stats = it.get("stats") or {}
            ver = (it.get("latestVersion") or {}).get("version") or (it.get("tags") or {}).get("latest")
            owner = (it.get("metadata") or {}).get("ownerHandle") or it.get("ownerHandle")
            slug = it.get("slug") or ""
            skills.append({
                "slug": slug,
                "displayName": it.get("displayName"),
                "summary": it.get("summary"),
                "version": ver,
                "owner": owner,
                "downloads": stats.get("downloads"),
                "stars": stats.get("stars"),
                "verified": None,
                "category": None,
                "source": self.id,
                "url": (self.base() + "/" + slug) if slug else None,
            })
        return {"ok": True, "skills": skills, "total": None}

    def resolve(self, slug: str) -> dict[str, Any]:
        res = http_json(f"{self.base()}/api/v1/skills/{urllib.parse.quote(slug)}")
        if not res["ok"]:
            return res
        data = res["data"] or {}
        skill = data.get("skill") or {}
        stats = skill.get("stats") or {}
        lv = data.get("latestVersion") or {}
        mod = data.get("moderation") or {}
        raw_upd = skill.get("updatedAt") or skill.get("createdAt")
        updated_at = None
        if isinstance(raw_upd, (int, float)):
            # ClawHub timestamps are epoch milliseconds.
            updated_at = float(raw_upd) / 1000.0 if raw_upd > 1e12 else float(raw_upd)
        clean = (mod.get("verdict") == "clean") and not mod.get("isMalwareBlocked")
        return {
            "ok": True,
            "version": lv.get("version"),
            "blocked": bool(mod.get("isMalwareBlocked")),
            "downloads": stats.get("downloads"),
            "stars": stats.get("stars"),
            "installs": stats.get("installsAllTime") or stats.get("installsCurrent"),
            "updated_at": updated_at,
            "license": lv.get("license"),
            "description": skill.get("summary"),
            "source": self.id,
            "moderation_clean": clean,
        }

    def download(self, slug: str, version: str | None) -> dict[str, Any]:
        params = {"slug": slug}
        if version:
            params["version"] = version
        return http_bytes(f"{self.base()}/api/v1/download?" + urllib.parse.urlencode(params),
                          token_env="CLAWHUB_TOKEN")

    def verify(self, slug: str, version: str | None) -> dict[str, Any] | None:
        q = {"version": version} if version else {"tag": "latest"}
        res = http_json(f"{self.base()}/api/v1/skills/{urllib.parse.quote(slug)}/verify?"
                        + urllib.parse.urlencode(q))
        if not res["ok"]:
            return {"ok": False, "error": res.get("error")}
        env = res["data"] or {}
        return {
            "ok": bool(env.get("ok")),
            "decision": env.get("decision"),
            "reasons": env.get("reasons"),
            "security_status": (env.get("security") or {}).get("status"),
            "publisher": env.get("publisherHandle"),
        }


class SkillHubRegistry(Registry):
    """api.skillhub.cn — China-focused skills market (public read API).

    Server-side search via GET /api/skills?keyword=&page=&pageSize= (params
    reverse-engineered from the web app's fetchSkillsPage). Download via
    GET /api/v1/download?slug= which 302-redirects to a zip artifact.
    """

    id = "skillhub"

    def __init__(self, base_url: str | None = None, rid: str | None = None):
        self._base = (base_url or "").rstrip("/") or None
        if rid:
            self.id = rid

    def base(self) -> str:
        return (self._base or get_settings().skillhub_base_url).rstrip("/")

    def _web_base(self) -> str:
        # The public website lives on the apex domain; the API on api.<domain>.
        return self.base().replace("//api.", "//")

    def _fetch(self, params: dict) -> dict[str, Any]:
        res = http_json(f"{self.base()}/api/skills?" + urllib.parse.urlencode(params))
        if not res["ok"]:
            return res
        d = (res["data"] or {}).get("data") or {}
        return {"ok": True, "items": d.get("skills", []), "total": d.get("total")}

    @staticmethod
    def _normalize(s: dict) -> dict:
        labels = s.get("labels") or {}
        return {
            "slug": s.get("slug"),
            "displayName": s.get("name"),
            "summary": s.get("description_zh") or s.get("description"),
            "version": s.get("version") or None,
            "owner": s.get("ownerName") or s.get("upstream_owner_login"),
            "verified": bool(s.get("verified")),
            "category": s.get("category") or None,
            "downloads": s.get("downloads"),
            "installs": s.get("installs"),
            "stars": s.get("stars"),
            "score": s.get("score"),
            "tags": s.get("tags"),
            "icon": s.get("iconUrl"),
            "updated_at": s.get("updated_at"),
            "source": s.get("source") or "skillhub",
            "requires_api_key": str(labels.get("requires_api_key", "")).lower() == "true",
            "url": None,  # set in search() to the public website
        }

    def search(self, query: str, limit: int, *, page: int = 1,
               category: str | None = None, sort: str | None = None) -> dict[str, Any]:
        params = {"page": str(max(1, int(page))), "pageSize": str(max(1, min(int(limit), 50)))}
        if query:
            params["keyword"] = query  # server-side search across 75k+ skills
        if category:
            params["category"] = category  # server-side category filter
        res = self._fetch(params)
        if not res["ok"]:
            return res
        web = self._web_base()
        skills = []
        for s in res["items"]:
            n = self._normalize(s)
            if n.get("slug"):
                n["url"] = web + "/skill/" + str(n["slug"])
            skills.append(n)
        skills = sort_skills(skills, sort)  # market has no server-side sort
        return {"ok": True, "skills": skills, "total": res.get("total")}

    def list_categories(self) -> list[str]:
        """Sample the most-popular listing to surface real category slugs."""
        res = self._fetch({"page": "1", "pageSize": "50"})
        if not res.get("ok"):
            return []
        seen: list[str] = []
        for s in res["items"]:
            c = s.get("category")
            if c and c not in seen:
                seen.append(c)
        return sorted(seen)

    def _find(self, slug: str) -> dict | None:
        res = self._fetch({"keyword": slug, "page": "1", "pageSize": "20"})
        if not res["ok"]:
            return None
        for s in res["items"]:
            if s.get("slug") == slug:
                return s
        return None

    def resolve(self, slug: str) -> dict[str, Any]:
        # Download works by slug alone; version is informational.
        s = self._find(slug)
        return {"ok": True, "version": (s or {}).get("version") or None, "blocked": False}

    def download(self, slug: str, version: str | None) -> dict[str, Any]:
        # 302 -> object storage zip; urllib follows the redirect for GET.
        return http_bytes(f"{self.base()}/api/v1/download?" + urllib.parse.urlencode({"slug": slug}))

    def verify(self, slug: str, version: str | None) -> dict[str, Any] | None:
        s = self._find(slug)
        if s is None:
            return None
        return {"ok": bool(s.get("verified")), "source": "skillhub",
                "security_status": "verified" if s.get("verified") else "unverified"}


class ClawHubMirrorRegistry(ClawHubRegistry):
    """ClawHub mirror behind a Volcengine API gateway (e.g. mirror-cn.clawhub.com).

    search / resolve / download are ClawHub-v1 compatible (verified by probing);
    only the *browse* (empty-query discover) endpoint differs — it lives at
    ``/v1/skills`` and returns a capitalised ``{"Skills": [...]}`` envelope. The
    gateway has no ``/verify``, so verification is treated as unavailable (not a
    failure) — install records show no trust verdict rather than a false negative.
    """

    id = "clawhub_mirror"

    def _browse(self, limit: int, sort: str | None) -> dict[str, Any]:
        url = f"{self.base()}/v1/skills?" + urllib.parse.urlencode(
            {"limit": max(1, min(int(limit), 50))}
        )
        res = http_json(url)
        if not res["ok"]:
            return res
        items = (res["data"] or {}).get("Skills", []) or []
        skills = []
        for it in items:
            slug = it.get("Slug") or ""
            desc = (it.get("Description") or "").strip().replace("\n", " ")
            skills.append({
                "slug": slug,
                "displayName": it.get("Name"),
                "summary": desc[:200],
                "version": None,
                "owner": it.get("Namespace"),
                "downloads": None,
                "stars": None,
                "verified": None,
                "category": None,
                "source": self.id,
                "url": (self.base() + "/" + slug) if slug else None,
            })
        return {"ok": True, "skills": skills, "total": None}

    def verify(self, slug: str, version: str | None) -> dict[str, Any] | None:
        r = super().verify(slug, version)
        # Mirror gateway lacks /verify → don't surface a misleading "verify failed".
        if r and r.get("error"):
            return None
        return r


class SkillsmpRegistry(Registry):
    """skillsmp.com — an index of GitHub-hosted Claude/agent skills (discovery source).

    Read-only search/browse via GET /api/skills?search=&limit=&page= →
    {"skills":[{id,name,author,description,githubUrl,stars,updatedAt,...}], pagination}.
    Skills live on GitHub; the slug we emit is the ``githubUrl`` so install routes
    through the native git path (works for repo-root URLs; /tree/<subpath> entries
    fail gracefully — users open the homepage link to view on GitHub). No zip/verify.
    """

    id = "skillsmp"

    def __init__(self, base_url: str | None = None, rid: str | None = None):
        self._base = (base_url or "").rstrip("/") or None
        if rid:
            self.id = rid

    def base(self) -> str:
        return (self._base or "http://skillsmp.com").rstrip("/")

    def _norm(self, s: dict) -> dict:
        gh = s.get("githubUrl")
        return {
            "slug": gh or s.get("id"),          # github URL → native git install
            "displayName": s.get("name"),
            "summary": s.get("description"),
            "version": None,
            "owner": s.get("author"),
            "verified": None,
            "category": None,
            "downloads": None,
            "stars": s.get("stars"),
            "updated_at": s.get("updatedAt"),
            "icon": s.get("authorAvatar"),
            "source": self.id,
            "url": gh,
        }

    def search(self, query: str, limit: int, *, page: int = 1,
               category: str | None = None, sort: str | None = None) -> dict[str, Any]:
        params = {"limit": str(max(1, min(int(limit), 50))), "page": str(max(1, int(page)))}
        if query:
            params["search"] = query
        res = http_json(f"{self.base()}/api/skills?" + urllib.parse.urlencode(params))
        if not res["ok"]:
            return res
        data = res["data"] or {}
        items = data.get("skills", []) or []
        skills = [self._norm(s) for s in items if (s.get("githubUrl") or s.get("id"))]
        skills = sort_skills(skills, sort)
        total = (data.get("pagination") or {}).get("total")
        return {"ok": True, "skills": skills, "total": total}

    def resolve(self, slug: str) -> dict[str, Any]:
        # slug is a GitHub URL; native git install handles it. No version metadata.
        return {"ok": True, "version": None, "blocked": False}

    def download(self, slug: str, version: str | None) -> dict[str, Any]:
        return {"ok": False, "retryable": False,
                "error": "skillsmp skills install from GitHub via git, not a zip download"}


# Adapter classes by market *type*. New markets reuse one of these by config.
_ADAPTERS = {
    "clawhub": ClawHubRegistry,
    "skillhub": SkillHubRegistry,
    "clawhub_mirror": ClawHubMirrorRegistry,
    "skillsmp": SkillsmpRegistry,
}


def _builtin_markets() -> dict:
    """Built-in markets. Base URLs for clawhub/skillhub honour env/config overrides."""
    s = get_settings()
    return {
        "clawhub": {"type": "clawhub", "base_url": s.registry_base_url, "label": "ClawHub · 官方"},
        "clawhub-cn": {"type": "clawhub_mirror",
                       "base_url": "https://mirror-cn.clawhub.com", "label": "ClawHub 国内镜像"},
        "skillhub": {"type": "skillhub", "base_url": s.skillhub_base_url, "label": "SkillHub.cn · 腾讯"},
        "skillsmp": {"type": "skillsmp",
                     "base_url": "http://skillsmp.com", "label": "SkillsMP · GitHub 技能索引"},
    }


def _config_markets() -> list[dict]:
    """User-defined extra markets from config (`omnilimb.markets`). Each entry:
    {id, type: clawhub|skillhub|clawhub_mirror, base_url, label?}."""
    out = []
    for m in (get_settings().extra_markets or []):
        if (isinstance(m, dict) and m.get("id") and m.get("base_url")
                and m.get("type") in _ADAPTERS):
            out.append({
                "id": str(m["id"]).lower(),
                "type": m["type"],
                "base_url": str(m["base_url"]),
                "label": m.get("label") or str(m["id"]),
            })
    return out


def list_markets() -> list[dict]:
    """All selectable markets (built-in + config) for the UI dropdown."""
    out = []
    for mid, d in _builtin_markets().items():
        out.append({"id": mid, "label": d["label"], "type": d["type"], "builtin": True})
    seen = {m["id"] for m in out}
    for m in _config_markets():
        if m["id"] not in seen:
            out.append({"id": m["id"], "label": m["label"], "type": m["type"], "builtin": False})
    return out


_REGISTRIES = {"clawhub": ClawHubRegistry, "skillhub": SkillHubRegistry}  # back-compat alias


def get_registry(market: str | None = None) -> Registry:
    mid = (market or get_settings().market or "clawhub").lower()
    bm = _builtin_markets()
    if mid in bm:
        d = bm[mid]
        return _ADAPTERS[d["type"]](base_url=d["base_url"], rid=mid)
    for m in _config_markets():
        if m["id"] == mid:
            return _ADAPTERS[m["type"]](base_url=m["base_url"], rid=mid)
    # Unknown market id → safe default.
    return ClawHubRegistry(rid="clawhub")
