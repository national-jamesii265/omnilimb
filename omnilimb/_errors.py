"""Feature H — map raw error strings to human-friendly {reason, fix} guidance.

Pure functions, no I/O. Used by install / smoke-test / run paths so the UI can
show "why + how to fix" instead of a raw stack trace. First matching rule wins.
"""

from __future__ import annotations

import re

# (regex, reason, fix). Patterns matched case-insensitively against the error.
_RULES: list[tuple[str, str, str]] = [
    (r"git_terminal_prompt|could not read username|authentication failed|terminal prompts disabled",
     "Git 需要认证（私有仓库或凭据缺失）",
     "确认该技能是公开仓库；私有仓库需先配置 Git 凭据，或改用注册表安装。"),
    (r"could not resolve host|name resolution|getaddrinfo|network is unreachable|connection refused|timed out|timeout|temporarily unavailable",
     "网络不可达或超时",
     "检查网络/代理后重试；上游市场可能临时不可用，可用缓存结果或切换市场。"),
    (r"permission denied|access is denied|eacces|operation not permitted",
     "权限不足",
     "检查目标目录写权限；尽量在工作区内安装，避免写入系统目录。"),
    (r"cannot connect to the docker daemon|docker daemon|docker.*not running|docker.*not found",
     "需要 Docker 但未运行/未安装",
     "安装并启动 Docker Desktop；或在设置里切到 native 后端用本地回退执行。"),
    (r"command not found|is not recognized|missing dependency|requires?\.?bins?",
     "缺少所需命令行依赖",
     "按技能 SKILL.md 的 requires.bins 安装对应工具后重试（见‘环境检查’）。"),
    (r"api[_ ]?key|unauthorized|\b401\b|invalid token|missing.*key|forbidden|\b403\b",
     "缺少或无效的 API Key",
     "在该技能详情页的‘凭据’区填入所需 API Key 后重试。"),
    (r"checksum|signature|verify failed|verification failed|integrity",
     "完整性/签名校验失败",
     "包内容与签名不符，可能被篡改或源异常；请勿强装，换可信源或反馈维护者。"),
    (r"unknown pack|not found|no such file|enoent|cannot find|does not exist|404",
     "目标不存在",
     "确认 slug/名称拼写正确，或先用搜索确认它在当前市场存在。"),
    (r"disk|no space left|enospc",
     "磁盘空间不足",
     "清理磁盘空间后重试。"),
]


def humanize(error) -> dict | None:
    """Return {reason, fix} for a raw error string, or None if there is no error."""
    if not error:
        return None
    text = str(error).lower()
    for pat, reason, fix in _RULES:
        if re.search(pat, text):
            return {"reason": reason, "fix": fix}
    return {
        "reason": "执行失败",
        "fix": "查看下方原始错误；可重试，或检查依赖/网络/凭据/权限。",
    }
