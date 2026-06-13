---
name: TMA SQLite DB path
description: The actual SQLite DB file lives at the workspace root, not inside tma_backend/
---

The TMA backend creates its SQLite DB relative to the **working directory of the uvicorn process**, which is `/home/runner/workspace`. So the file is:

```
/home/runner/workspace/tma.db   ← CORRECT
/home/runner/workspace/tma_backend/tma.db  ← WRONG (does not exist)
```

**Why:** `database.py` uses `sqlite:///tma.db` (relative path). Uvicorn is launched from the workspace root via `python -m tma_backend.main`, so the CWD is the workspace root.

**How to apply:** When you need to wipe and reseed the DB, always delete `/home/runner/workspace/tma.db`, NOT `tma_backend/tma.db`.
