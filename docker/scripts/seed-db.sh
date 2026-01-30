#!/bin/bash
# Run database seed after migrations

set -e

echo "Running database migrations..."
pnpm db:migrate

echo "Seeding database..."
pnpm db:seed

echo "Database setup complete!"
