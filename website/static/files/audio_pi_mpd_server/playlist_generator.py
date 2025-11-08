import os
import sys
from mutagen import File
from typing import List, Optional, Tuple

if len(sys.argv) != 3:
    sys.exit("Usage: python playlist_generator.py <SCAN_DIR> <PLAYLIST_FILE_OUTPUT>\r\nBoth arguments use absolute paths.")

# Make sure to include a trailing slash so the playlist directory is correctly input.
SCAN_DIR = sys.argv[1]
PLAYLIST_OUTPUT_FILE = sys.argv[2]

def get_song_tags(filepath: str) -> Optional[dict]:
    """Extracts relevant tag data from a song file.

    Args:
        filepath: Path to the song file.

    Returns:
        A dictionary containing the extracted tag data, or None if the file
        could not be processed.
    """
    try:
        audio = File(filepath, easy=True) # Use easy=True for simplified tag access
        if audio is None:
            print(f"Warning: Could not process file {filepath}")
            return None

        # Extract tags, handling potential missing keys gracefully
        # Default to empty strings for text fields and 0 for numerical fields
        # Use the first value if a tag has multiple values
        album_artist = (audio.get("albumartist", [None])[0] or
                        audio.get("artist", ["Unknown Artist"])[0] or
                        "Unknown Artist")
        artist = audio.get("artist", ["Unknown Artist"])[0] or "Unknown Artist"
        date_str = audio.get("date", [""])[0] or ""
        album = audio.get("album", ["Unknown Album"])[0] or "Unknown Album"

        # Handle disc and track number parsing, including 'x/y' format
        disc_number_str = str(audio.get("discnumber", ["0"])[0] or "0").split("/")[0]
        disc_number = int(disc_number_str) if disc_number_str.isdigit() else 0

        track_number_str = str(audio.get("tracknumber", ["0"])[0] or "0").split("/")[0]
        track_number = int(track_number_str) if track_number_str.isdigit() else 0

        title = audio.get("title", [os.path.basename(filepath)])[0] or os.path.basename(filepath)

        # Attempt to parse date, defaulting to 0 if not a valid year
        try:
            sort_date = int(date_str[:4]) if date_str and len(date_str) >= 4 and date_str[:4].isdigit() else 0
        except ValueError:
            sort_date = 0
        tag_data = {
            "filepath": filepath,
            "album_artist": album_artist.strip().lower(),
            "artist": artist.strip().lower(),
            "date": sort_date,
            "album": album.strip().lower(),
            "disc_number": disc_number,
            "track_number": track_number,
            "title": title.strip().lower(),
        }
        #print(tag_data)
        return tag_data

    except Exception as e:
        print(f"Error processing file {filepath}: {e}")
        return None

def collect_music_files(root_dir):
    songs = []
    audio_exts = {'.mp3', '.flac', '.m4a', '.mp4', '.ogg', '.opus', '.wma', '.wav'}
    for dirpath, _, filenames in os.walk(root_dir):
        for fname in filenames:
            ext = os.path.splitext(fname)[1].lower()
            if ext not in audio_exts:
                continue

            full_path = os.path.join(dirpath, fname)

            #Print the current file path so you can see it's working:
            msg = f'Processing: {full_path}'
            print('\r' + msg.ljust(200), end='')   # 80 blanks erase leftovers
            sys.stdout.flush()

            songs.append(get_song_tags(os.path.abspath(full_path)))
    return songs


def sort_songs(songs_with_tags: List[str]) -> List[str]:
    """Sorts a list of song file paths based on their tag data.

    The sorting criteria, in order, are:
    1. Album Artist (or Artist if Album Artist is missing)
    2. Date (year)
    3. Album Name
    4. Disc Number
    5. Track Number
    6. Title

    Args:
        filepaths: A list of paths to song files.

    Returns:
        A new list of file paths, sorted according to the criteria.
    """

    # Sort using a tuple as the key
    songs_with_tags.sort(
        key=lambda x: (
            x["album_artist"],
            x["date"],
            x["album"],
            x["disc_number"],
            x["track_number"],
            x["title"],
        )
    )

    return [song["filepath"] for song in songs_with_tags]

# --- Example Usage ---
if __name__ == "__main__":
    # Replace this list with your actual file paths
    song_files = collect_music_files(SCAN_DIR)

    print("\r\nSorting songs...\r\n")
    sorted_songs = sort_songs(song_files)

    with open(PLAYLIST_OUTPUT_FILE, "w", encoding="utf-8") as f:
        for song_path in sorted_songs:
            f.write(song_path.removeprefix(SCAN_DIR) + "\r\n")

    #Make sure the file permissions are set correctly so mpd can use the new playlist:
    os.chmod(PLAYLIST_OUTPUT_FILE, 0o644)
    os.chown(PLAYLIST_OUTPUT_FILE, 105, 29);

    print(f"Playlist file from `{SCAN_DIR}` output to `{PLAYLIST_OUTPUT_FILE}`.")
    