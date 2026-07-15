#!/usr/bin/env python3
"""Generate 400px-tall thumbnails for images in static/files/, mirrored under static/thumbs/."""

import argparse
import os
import sys
from pathlib import Path

from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
THUMB_HEIGHT = 400
STATIC_DIR = Path(__file__).resolve().parent / "static"
SOURCE_DIR = STATIC_DIR / "files"
THUMBS_DIR = STATIC_DIR / "thumbs"


def is_animated_gif(path: Path) -> bool:
    try:
        with Image.open(path) as img:
            return getattr(img, "is_animated", False)
    except Exception:
        return False


def generate_thumb(source: Path, thumbs_dir: Path, force: bool) -> bool:
    """Generate a thumbnail for *source*. Returns True if a thumbnail was created."""
    rel = source.relative_to(SOURCE_DIR)
    dest = thumbs_dir / rel

    if not force and dest.exists():
        src_mtime = source.stat().st_mtime
        dst_mtime = dest.stat().st_mtime
        if dst_mtime >= src_mtime:
            return False  # already up to date

    dest.parent.mkdir(parents=True, exist_ok=True)

    if is_animated_gif(source):
        # Preserve animated GIFs as-is (full size)
        import shutil

        shutil.copy2(source, dest)
    else:
        try:
            with Image.open(source) as img:
                img.thumbnail((img.width, THUMB_HEIGHT), Image.LANCZOS)
                img.save(dest)
        except Exception as e:
            print(f"Warning: could not process {source}: {e}", file=sys.stderr)
            return False

    return True


def main():
    parser = argparse.ArgumentParser(description="Generate blog image thumbnails.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Regenerate all thumbnails regardless of timestamps",
    )
    args = parser.parse_args()

    if not SOURCE_DIR.is_dir():
        print(f"Source directory not found: {SOURCE_DIR}")
        sys.exit(1)

    THUMBS_DIR.mkdir(parents=True, exist_ok=True)

    generated = 0
    up_to_date = 0

    for root, _dirs, files in os.walk(SOURCE_DIR):
        root_path = Path(root)
        for name in sorted(files):
            ext = Path(name).suffix.lower()
            if ext not in SUPPORTED_EXTENSIONS:
                continue
            source = root_path / name
            if generate_thumb(source, THUMBS_DIR, args.force):
                generated += 1
            else:
                up_to_date += 1

    print(f"Generated {generated} thumbnails, {up_to_date} already up to date.")


if __name__ == "__main__":
    main()
