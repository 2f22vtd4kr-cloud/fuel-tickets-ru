#!/bin/bash
set -e

pip install -r requirements.txt --quiet

pnpm install --frozen-lockfile --ignore-scripts || pnpm install --frozen-lockfile
