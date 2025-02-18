#!/bin/bash

# Print what we're going to do
echo "Starting cleanup process..."
echo "This script will:"
echo "1. Delete all node_modules directories"
echo "2. Delete lock files (bun.lock, pnpm-lock.yaml, yarn.lock, package-lock.json)"
echo

# Find and delete node_modules directories
echo "Deleting node_modules directories..."
find . -type d -name "node_modules" -not -path "*/.git/*" -exec rm -rf {} +

# Find and delete lock files
echo "Deleting lock files..."
find . -not -path "*/.git/*" -not -path "*/node_modules/*" -type f \( \
  -name "bun.lock" -o \
  -name "pnpm-lock.yaml" -o \
  -name "yarn.lock" -o \
  -name "package-lock.json" \
\) -exec rm -f {} +

echo "Cleanup completed!"
