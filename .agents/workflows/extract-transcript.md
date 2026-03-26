---
description: How to extract YouTube transcripts and create episode pages
---

# Transcript Extraction & Episode Page Workflow

## Prerequisites
```bash
pip install youtube-transcript-api
```

## Step 1: Extract Transcripts

### Single video:
// turbo
```bash
python extract_transcripts.py https://youtu.be/VIDEO_ID
```

### Multiple videos:
// turbo
```bash
python extract_transcripts.py https://youtu.be/ID1 https://youtu.be/ID2 https://youtu.be/ID3
```

### From a file (one URL per line):
// turbo
```bash
python extract_transcripts.py --file urls.txt
```

Output goes to `transcripts/<videoId>.json`.

## Step 2: Assign Speakers

The YouTube API does NOT provide speaker labels. After extraction, open the JSON file and replace `"Unknown"` with the actual speaker name.

**Tips:**
- Listen to the first 30s of each segment to identify the speaker.
- For WTF episodes, the host is always "Nikhil Kamath".
- Guests are listed in the episode's `data.ts` entry.

## Step 3: Add Transcript to data.ts

Copy the `transcript` array from the JSON file into the episode's `parsedTranscript` field in `src/lib/data.ts`.

```typescript
{
  id: "ep-XX",
  // ... other fields
  parsedTranscript: [
    // PASTE the JSON array here
  ]
}
```

## Step 4: Create a Specific Episode Page (Optional)

To create a custom episode page like `ep-wtf-16`:

1. Create folder: `src/app/episode/<episode-id>/page.tsx`
2. Create transcript subpage: `src/app/episode/<episode-id>/transcript/page.tsx`
3. Reference the `ep-wtf-16` page as a template.

## JSON Schema Reference

```json
{
  "videoId": "FPV5fAkqyBs",
  "lineCount": 150,
  "transcript": [
    {
      "speaker": "Nikhil Kamath",
      "timestamp": "00:00",
      "content": "Welcome to another episode..."
    }
  ]
}
```

## Providing Guest Images for Polaroids

1. Save portrait images to `public/images/guests/`
2. Name them: `firstname.jpg` (e.g. `ritesh.jpg`, `ghazal.jpg`)
3. Reference in the page component's Polaroid section.
