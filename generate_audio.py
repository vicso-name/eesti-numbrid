"""
Eesti Numbrid — Audio Generator (stages 5-8)
Google Cloud TTS · Chirp3-HD-Umbriel · Estonian

Generates 46 audio files for new phrase patterns:
  Stage 5: Pronouns (sul/tal/meil/teil/neil on)
  Stage 6: Age (Ma olen ... aastat vana)
  Stage 7: Questions & negation (Kas sul on? / Ei ole)
  Stage 8: Family (poeg, tütar, laps)

Usage:
  python generate_audio_v2.py
"""

from google.cloud import texttospeech
import os
import re

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "alefbettutor-6097c797d04a.json"
client = texttospeech.TextToSpeechClient()


def make_filename(text):
    name = text.lower().strip().rstrip("?.,!").strip()
    name = re.sub(r'[^a-zõäöü\s]', '', name)
    name = re.sub(r'\s+', '_', name.strip())
    return name


# ═══════════════════════════════════════════
# New phrases for stages 5-8
# ═══════════════════════════════════════════

PHRASES = [
    # ── Stage 5: Pronouns ──
    "Sul on üks õun",
    "Sul on kolm koera",
    "Sul on viis kassi",
    "Tal on kaks raamatut",
    "Tal on neli õuna",
    "Tal on üks koer",
    "Meil on kolm kassi",
    "Meil on viis raamatut",
    "Teil on kaks koera",
    "Neil on neli õuna",
    "Neil on üks kass",
    "Sul on kaks õuna",

    # ── Stage 6: Age ──
    "Ma olen viis aastat vana",
    "Ma olen seitse aastat vana",
    "Ma olen kümme aastat vana",
    "Sa oled viis aastat vana",
    "Sa oled kaheksa aastat vana",
    "Ta on kolm aastat vana",
    "Ta on kuus aastat vana",
    "Ta on üheksa aastat vana",
    "Ta on viisteist aastat vana",
    "Ta on kaheksateist aastat vana",
    "Kui vana sa oled",
    "Kui vana ta on",

    # ── Stage 7: Questions & negation ──
    "Kas sul on kaks koera",
    "Jah, mul on kaks koera",
    "Kas sul on kolm kassi",
    "Ei, mul ei ole kassi aga mul on üks koer",
    "Kas tal on viis raamatut",
    "Jah, tal on viis raamatut",
    "Mul ei ole ühtegi koera",
    "Kas teil on neli õuna",
    "Jah, meil on neli õuna",
    "Ei, mul ei ole raamatut aga mul on kaks õuna",
    "Kas neil on seitse kassi",
    "Jah, neil on seitse kassi",

    # ── Stage 8: Family ──
    "Mul on üks poeg",
    "Mul on kaks poega",
    "Mul on üks tütar",
    "Mul on kolm tütart",
    "Mul on kaks last",
    "Tal on poeg ja tütar",
    "Kas sul on lapsi",
    "Mul ei ole lapsi",
    "Tal on kolm last",
    "Mul on poeg ja kaks tütart",
]


# ═══════════════════════════════════════════
# SSML wrapper for better pronunciation quality
# ═══════════════════════════════════════════

def wrap_ssml(text):
    """
    Wrap phrase in SSML for higher quality output:
    - <speak> root tag (required for SSML)
    - <prosody> for natural speech rate
    - Questions get rising intonation via <emphasis>
    - Commas get natural pauses via <break>
    """
    # Escape XML special chars
    safe = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    # Add natural pauses at commas
    safe = safe.replace(",", ',<break time="250ms"/>')

    # Add slight pause before "aga" (but/however) for natural rhythm
    safe = safe.replace(" aga ", '<break time="200ms"/> aga ')

    # Questions: Kas... / Kui...
    is_question = text.lower().startswith("kas ") or text.lower().startswith("kui ")

    if is_question:
        return f'<speak><prosody rate="93%" pitch="+0.5st">{safe}</prosody></speak>'
    else:
        return f'<speak><prosody rate="93%">{safe}</prosody></speak>'


# ═══════════════════════════════════════════
# Generate
# ═══════════════════════════════════════════

output_dir = "audio"
os.makedirs(output_dir, exist_ok=True)

voice = texttospeech.VoiceSelectionParams(
    language_code="et-EE",
    name="et-EE-Chirp3-HD-Umbriel",
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
    # Higher bitrate for clearer audio
    sample_rate_hertz=24000,
    effects_profile_id=["headphone-class-device"],
)

# Deduplicate
phrases = list(dict.fromkeys(PHRASES))

print(f"🔊 Eesti Numbrid — Audio Generator v2 (stages 5-8)")
print(f"   Voice: et-EE-Chirp3-HD-Umbriel")
print(f"   SSML: enabled (pauses, prosody, question intonation)")
print(f"   Audio: 24kHz MP3 + headphone profile")
print(f"   Phrases: {len(phrases)}")
print()

generated = []
skipped = []
errors = []

for i, text in enumerate(phrases, 1):
    filename = f"{make_filename(text)}.mp3"
    filepath = os.path.join(output_dir, filename)

    if os.path.exists(filepath):
        print(f"  [{i:2d}/{len(phrases)}] ⏭  {filename}")
        skipped.append(filename)
        continue

    ssml = wrap_ssml(text)
    print(f"  [{i:2d}/{len(phrases)}] 🎵 {text}")
    print(f"           → {filename}")

    try:
        resp = client.synthesize_speech(
            input=texttospeech.SynthesisInput(ssml=ssml),
            voice=voice,
            audio_config=audio_config,
        )
        with open(filepath, "wb") as f:
            f.write(resp.audio_content)
        size_kb = len(resp.audio_content) / 1024
        print(f"           ✅ {size_kb:.1f} KB")
        generated.append(filename)
    except Exception as e:
        print(f"           ❌ {e}")
        errors.append((text, str(e)))

print(f"\n{'═' * 44}")
print(f"  Generated: {len(generated)}")
print(f"  Skipped:   {len(skipped)} (already exist)")
print(f"  Errors:    {len(errors)}")
print(f"{'═' * 44}")

if errors:
    print("\n⚠ Errors:")
    for t, e in errors:
        print(f"  - {t}: {e}")

print(f"\n📁 Files in: {os.path.abspath(output_dir)}/")