#!/usr/bin/env sh
# generate_local_test_site.sh
#
# Uses `mise exec` to ensure zola and python are available.
#
# Build the twa.ninja static site to a local directory (outside Dropbox)
# and serve it for testing.
#
# Usage:
#   ./generate_local_test_site.sh                  # defaults: ~/code/twa.ninja :8000
#   ./generate_local_test_site.sh ~/code/site 9000  # custom values
#
# The built site goes into <output_dir>/public/ so sibling directories
# (e.g. logs/) can be added later without cluttering the web root.

set -e

OUTPUT_DIR="${1:-$HOME/code/twa.ninja}"
PORT="${2:-8000}"
PUBLIC_DIR="$OUTPUT_DIR/public"
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Output directory: $OUTPUT_DIR"
echo "==> Port:            $PORT"
echo ""

# Step 1: generate thumbnails for static images
echo "==> Generating thumbnails..."
cd "$REPO_DIR/website"
mise exec -- python3 generate-thumbs.py

# Step 2: build the site with Zola
echo ""
echo "==> Building site with Zola..."
mkdir -p "$PUBLIC_DIR"
mise exec -- zola build \
    --output-dir "$PUBLIC_DIR" \
    --base-url "http://localhost:$PORT" \
    --force

# Step 3: print the URL and start the server
echo ""
echo "============================================"
echo "  Serving at: http://localhost:$PORT"
echo "  Press Ctrl+C to stop."
echo "============================================"
echo ""

mise exec -- python3 -m http.server "$PORT" --directory "$PUBLIC_DIR"
