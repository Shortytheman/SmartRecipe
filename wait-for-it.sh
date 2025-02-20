#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" "${port:-3306}"; do
  echo "Waiting for MySQL to be ready..."
  sleep 2
done

echo "MySQL is up - executing command"
exec $cmd