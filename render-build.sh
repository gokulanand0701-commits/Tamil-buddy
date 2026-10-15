#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=== 1/3 Installing Node dependencies ==="
npm install

echo "=== 2/3 Building Vite React frontend ==="
npm run build

echo "=== 3/3 Installing Python backend requirements ==="
pip install --upgrade pip
pip install -r requirements.txt

echo "=== Build finished successfully! ==="
