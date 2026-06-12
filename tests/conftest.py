"""Shared pytest fixtures for the Omnilimb test suite (free community edition)."""

from __future__ import annotations

import pytest

import omnilimb.config as _cfg


@pytest.fixture(autouse=True)
def _fresh_settings():
    """Rebuild the settings cache around each test so env/config tweaks apply."""
    _cfg.reload_settings()
    yield
    _cfg.reload_settings()
