"""
Echoes — YouTube Transcript Extractor
======================================
Extracts transcripts from YouTube videos and saves them as JSON files
that can be directly referenced by the Next.js app.

Usage:
  python extract_transcripts.py <youtube_url_1> <youtube_url_2> ...
  python extract_transcripts.py --file urls.txt

Output:
  Creates JSON files in ./transcripts/ named by video ID.
  e.g. transcripts/FPV5fAkqyBs.json

The JSON format matches the `parsedTranscript` schema in data.ts:
  [
    {
      "speaker": "Unknown",
      "timestamp": "00:00",
      "content": "..."
    },
    ...
  ]

Note: YouTube auto-generated transcripts do NOT have speaker labels.
You will need to manually assign speakers after extraction.
See the WORKFLOW section at the bottom of this file.
"""

import json
import os
import sys
import re
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print("ERROR: youtube-transcript-api not installed.")
    print("Run: pip install youtube-transcript-api")
    sys.exit(1)


def extract_video_id(url: str) -> str:
    """Extract the video ID from various YouTube URL formats."""
    patterns = [
        r'(?:v=|\/v\/|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$'  # bare video ID
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError(f"Could not extract video ID from: {url}")


def format_timestamp(seconds: float) -> str:
    """Convert seconds to HH:MM:SS or MM:SS format."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def merge_short_segments(segments: list, min_chars: int = 80) -> list:
    """Merge very short consecutive segments into longer ones for readability."""
    if not segments:
        return segments
    
    merged = [segments[0].copy()]
    for seg in segments[1:]:
        last = merged[-1]
        if len(last["content"]) < min_chars:
            last["content"] += " " + seg["content"]
        else:
            merged.append(seg.copy())
    return merged


def fetch_transcript(video_id: str, languages: list = None) -> list:
    """Fetch and format transcript from YouTube."""
    if languages is None:
        languages = ['en', 'en-IN', 'hi']
    
    ytt_api = YouTubeTranscriptApi()
    transcript = ytt_api.fetch(video_id, languages=languages)
    
    raw_lines = []
    for entry in transcript:
        raw_lines.append({
            "speaker": "Unknown",
            "timestamp": format_timestamp(entry.start),
            "content": entry.text.strip().replace("\n", " ")
        })
    
    # Merge very short segments
    merged = merge_short_segments(raw_lines, min_chars=60)
    return merged


def save_transcript(video_id: str, transcript: list, output_dir: str = "transcripts"):
    """Save transcript to JSON — both working copy and public/ for Next.js."""
    data = {
        "videoId": video_id,
        "lineCount": len(transcript),
        "transcript": transcript
    }
    
    # Save to transcripts/ (working copy)
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f"{video_id}.json")
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Also save to public/transcripts/ (served by Next.js)
    public_dir = os.path.join("public", "transcripts")
    os.makedirs(public_dir, exist_ok=True)
    public_path = os.path.join(public_dir, f"{video_id}.json")
    with open(public_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"  ✓ Saved {len(transcript)} lines → {filepath}")
    print(f"  ✓ Copied to → {public_path} (served by Next.js)")
    return filepath


def main():
    urls = []
    
    if len(sys.argv) < 2:
        print("Usage: python extract_transcripts.py <url1> <url2> ...")
        print("       python extract_transcripts.py --file urls.txt")
        sys.exit(1)
    
    if sys.argv[1] == '--file':
        filepath = sys.argv[2]
        with open(filepath, 'r') as f:
            urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    else:
        urls = sys.argv[1:]
    
    print(f"\n{'='*60}")
    print(f"  Echoes Transcript Extractor")
    print(f"  Processing {len(urls)} video(s)")
    print(f"{'='*60}\n")
    
    results = []
    for url in urls:
        try:
            video_id = extract_video_id(url)
            print(f"  Fetching: {video_id} ...")
            transcript = fetch_transcript(video_id)
            filepath = save_transcript(video_id, transcript)
            results.append({"videoId": video_id, "file": filepath, "lines": len(transcript), "status": "ok"})
        except Exception as e:
            print(f"  ✗ Error for {url}: {e}")
            results.append({"url": url, "status": "error", "error": str(e)})
    
    print(f"\n{'='*60}")
    print(f"  Done! {sum(1 for r in results if r['status'] == 'ok')}/{len(results)} succeeded.")
    print(f"{'='*60}\n")
    
    # Print summary
    for r in results:
        if r['status'] == 'ok':
            print(f"  ✓ {r['videoId']}: {r['lines']} lines → {r['file']}")
        else:
            print(f"  ✗ {r.get('url', 'unknown')}: {r['error']}")


if __name__ == "__main__":
    main()
