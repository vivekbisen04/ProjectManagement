#!/bin/bash
set -e

echo "Waiting for database..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Create sample data if it doesn't exist
echo "Creating sample data..."
python manage.py create_sample_data || echo "Sample data already exists or command not available"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting Django server..."
exec "$@"