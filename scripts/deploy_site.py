#!/usr/bin/env python3
"""Deploy the static Omnilimb website (``website/``) to the omnilimb.com web root over FTP.

Credentials are read from the environment (or an untracked local config) and are
NEVER hardcoded or committed. Required environment variables:

    OMNILIMB_FTP_HOST   e.g. ftp.example.com
    OMNILIMB_FTP_USER   e.g. your-ftp-user
    OMNILIMB_FTP_PASS   the FTP password
    OMNILIMB_FTP_PORT   optional, default 21
    OMNILIMB_FTP_DIR    optional remote web-root subdir (default: login directory)

Alternatively, place an untracked JSON file ``.deploy.local.json`` at the repo
root with keys host/user/pass/port/dir (this path is git-ignored).

Usage:
    py -3.11 scripts/deploy_site.py [--dir website] [--remote /]
The script uploads every file under the local site directory, verifies each
uploaded file's size matches the local source, prints the uploaded file count,
and exits non-zero with a descriptive message on any missing credential or
upload/verification failure.
"""

from __future__ import annotations

import argparse
import ftplib
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class _NatFTP(ftplib.FTP):
    """FTP client that ignores the server-advertised PASV IP and reuses the
    control-connection host. Fixes passive transfers when the server sits behind
    NAT and advertises a private/unreachable address."""

    def makepasv(self):
        host, port = super().makepasv()
        return self.host, port


def _load_config() -> dict:
    cfg = {}
    local = ROOT / ".deploy.local.json"
    if local.exists():
        try:
            cfg = json.loads(local.read_text(encoding="utf-8")) or {}
        except Exception as exc:  # noqa: BLE001
            print(f"ERROR: failed to read {local.name}: {exc}", file=sys.stderr)
            sys.exit(2)
    # Environment variables override the file.
    env = os.environ.get
    return {
        "host": env("OMNILIMB_FTP_HOST") or cfg.get("host"),
        "user": env("OMNILIMB_FTP_USER") or cfg.get("user"),
        "pass": env("OMNILIMB_FTP_PASS") or cfg.get("pass"),
        "port": int(env("OMNILIMB_FTP_PORT") or cfg.get("port") or 21),
        "dir": env("OMNILIMB_FTP_DIR") or cfg.get("dir") or "",
    }


def _iter_files(base: Path):
    for p in sorted(base.rglob("*")):
        if p.is_file():
            yield p, p.relative_to(base).as_posix()


def _ensure_remote_dirs(ftp: ftplib.FTP, rel_dir: str) -> None:
    if not rel_dir:
        return
    parts = [seg for seg in rel_dir.split("/") if seg]
    for seg in parts:
        try:
            ftp.cwd(seg)
        except ftplib.error_perm:
            ftp.mkd(seg)
            ftp.cwd(seg)


def main() -> int:
    ap = argparse.ArgumentParser(description="Deploy the Omnilimb website over FTP")
    ap.add_argument("--dir", default="website", help="local site directory (default: website)")
    ap.add_argument("--remote", default=None, help="remote web-root subdir (overrides config 'dir')")
    args = ap.parse_args()

    site = (ROOT / args.dir).resolve()
    if not site.is_dir() or not (site / "index.html").exists():
        print(f"ERROR: site directory '{site}' not found or missing index.html", file=sys.stderr)
        return 2

    cfg = _load_config()
    remote_root = args.remote if args.remote is not None else cfg["dir"]
    missing = [k for k in ("host", "user", "pass") if not cfg.get(k)]
    if missing:
        print(
            "ERROR: missing FTP credentials: "
            + ", ".join("OMNILIMB_FTP_" + m.upper() for m in missing)
            + ". Set them as environment variables or in .deploy.local.json. "
            "Nothing was uploaded.",
            file=sys.stderr,
        )
        return 2

    files = list(_iter_files(site))
    if not files:
        print(f"ERROR: no files found under {site}", file=sys.stderr)
        return 2

    print(f"Connecting to {cfg['host']}:{cfg['port']} as {cfg['user']} …")
    try:
        ftp = _NatFTP()
        ftp.connect(cfg["host"], cfg["port"], timeout=30)
        ftp.login(cfg["user"], cfg["pass"])
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: FTP connect/login failed: {exc}", file=sys.stderr)
        return 1

    uploaded = 0
    try:
        # Passive ports are firewalled on this host; active mode works. Allow override.
        passive = (os.environ.get("OMNILIMB_FTP_PASSIVE", "0").strip().lower() in ("1", "true", "yes"))
        ftp.set_pasv(passive)
        login_dir = ftp.pwd()
        for local, rel in files:
            # Reset to login dir, then descend into the remote root + file's subdir.
            ftp.cwd(login_dir)
            sub = "/".join([p for p in [remote_root.strip("/"), os.path.dirname(rel)] if p])
            _ensure_remote_dirs(ftp, sub)
            name = os.path.basename(rel)
            with open(local, "rb") as fh:
                ftp.storbinary(f"STOR {name}", fh)
            # Verify size matches.
            local_size = local.stat().st_size
            try:
                remote_size = ftp.size(name)
            except Exception:  # noqa: BLE001
                remote_size = None
            if remote_size is not None and remote_size != local_size:
                print(
                    f"ERROR: size mismatch for {rel}: local {local_size} != remote {remote_size}",
                    file=sys.stderr,
                )
                return 1
            uploaded += 1
            print(f"  uploaded {rel} ({local_size} bytes)")
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: upload failed: {exc}", file=sys.stderr)
        return 1
    finally:
        try:
            ftp.quit()
        except Exception:  # noqa: BLE001
            pass

    print(f"\nDONE: uploaded {uploaded} file(s) to {cfg['host']}"
          + (f"/{remote_root.strip('/')}" if remote_root.strip('/') else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
