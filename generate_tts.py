from google.cloud import texttospeech
import os
import re

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "alefbettutor-6097c797d04a.json"
client = texttospeech.TextToSpeechClient()

# ── DATA ──
NUMBERS = [
    (1,'üks','esimene'),(2,'kaks','teine'),(3,'kolm','kolmas'),
    (4,'neli','neljas'),(5,'viis','viies'),(6,'kuus','kuues'),
    (7,'seitse','seitsmes'),(8,'kaheksa','kaheksas'),(9,'üheksa','üheksas'),
    (10,'kümme','kümnes'),(11,'üksteist',None),(12,'kaksteist',None),
    (13,'kolmteist',None),(14,'neliteist',None),(15,'viisteist',None),
    (16,'kuusteist',None),(17,'seitseteist',None),(18,'kaheksateist',None),
    (19,'üheksateist',None),(20,'kakskümmend',None),(30,'kolmkümmend',None),
    (40,'nelikümmend',None),(50,'viiskümmend',None),(60,'kuuskümmend',None),
    (70,'seitsekümmend',None),(80,'kaheksakümmend',None),(90,'üheksakümmend',None),
    (100,'sada',None),
]

NOUNS = [
    ('õun','õuna'),   # яблоко
    ('raamat','raamatut'),  # книга
    ('koer','koera'),  # собака
    ('kass','kassi'),  # кошка
]

def make_filename(text):
    name = text.lower().strip().rstrip("?.,!").strip()
    name = re.sub(r'[^a-zõäöü\s]', '', name)
    name = re.sub(r'\s+', '_', name.strip())
    return name

# ── BUILD SENTENCE LIST ──
sentences = []

for n, et, ord_et in NUMBERS:
    # Cardinal number word
    sentences.append(et)

    # Ordinal (if exists, 1-10)
    if ord_et:
        sentences.append(ord_et)

    # Sentences with nouns (1-19 only)
    if 1 <= n <= 19:
        for nom, part in NOUNS:
            noun_form = nom if n == 1 else part
            sentence = f"Mul on {et} {noun_form}"
            sentences.append(sentence)

# Deduplicate
sentences = list(dict.fromkeys(sentences))
print(f"📚 Всего фраз для озвучки: {len(sentences)}")

# ── GENERATE ──
output_dir = "audio"
os.makedirs(output_dir, exist_ok=True)

voice = texttospeech.VoiceSelectionParams(
    language_code="et-EE",
    name="et-EE-Chirp3-HD-Umbriel",
)
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
    speaking_rate=0.9,
)

generated, errors = [], []

for i, text in enumerate(sentences, 1):
    filename = f"{make_filename(text)}.mp3"
    filepath = os.path.join(output_dir, filename)

    if os.path.exists(filepath):
        print(f"[{i}/{len(sentences)}] ⏭ {filename}")
        generated.append(filename)
        continue

    print(f"[{i}/{len(sentences)}] 🎵 {text} -> {filename}")
    try:
        resp = client.synthesize_speech(
            input=texttospeech.SynthesisInput(text=text),
            voice=voice, audio_config=audio_config
        )
        with open(filepath, "wb") as f:
            f.write(resp.audio_content)
        generated.append(filename)
    except Exception as e:
        print(f"  ❌ {e}")
        errors.append((text, str(e)))

print(f"\n🎉 Готово! Создано: {len(generated)} файлов")
if errors:
    print(f"⚠ Ошибки: {len(errors)}")
    for t, e in errors:
        print(f"  - {t}: {e}")
print(f"\n📁 Файлы в папке: {output_dir}/")
