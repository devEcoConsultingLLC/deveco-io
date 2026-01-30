#!/bin/bash
# Initialize MinIO buckets on first run

set -e

echo "Waiting for MinIO to be ready..."
until mc alias set local http://localhost:9000 minioadmin minioadmin 2>/dev/null; do
  sleep 1
done

echo "Creating deveco bucket..."
mc mb local/deveco --ignore-existing

echo "Setting bucket policy to public read..."
mc anonymous set download local/deveco

echo "MinIO initialization complete!"
