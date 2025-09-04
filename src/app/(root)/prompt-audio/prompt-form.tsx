/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tts/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

// ---- Types & constants ----
type AudioFormat = "mp3" | "wav";
const VOICE_OPTIONS = ["Kore", "Puck", "Enceladus"] as const;
type VoiceName = (typeof VOICE_OPTIONS)[number];
type Mode = "single" | "multi";

// Tách speaker từ script dạng "Name: câu nói"
function detectSpeakers(script: string): string[] {
  const set = new Set<string>();
  for (const line of script.split(/\r?\n/)) {
    const m = line.match(/^\s*([^:]+)\s*:\s*(.+)$/);
    if (m) set.add(m[1].trim());
  }
  return Array.from(set);
}

export default function TTSPage() {
  // Chế độ
  const [mode, setMode] = useState<Mode>("single");

  // Script & cấu hình chung
  const [text, setText] = useState(
    "Say cheerfully: Have a wonderful day!\n\n// Multi-speaker ví dụ:\n// Alice: Hello Bob!\n// Bob: Hi Alice!"
  );
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [bitrate, setBitrate] = useState<number>(64); // chỉ áp dụng khi MP3

  // Single voice
  const [singleVoice, setSingleVoice] = useState<VoiceName>("Kore");

  // Multi-speaker: đúng 2 speakers & 2 voices khác nhau
  const detected = useMemo(() => detectSpeakers(text), [text]);
  const [speakerA, setSpeakerA] = useState<string | null>(null);
  const [speakerB, setSpeakerB] = useState<string | null>(null);
  const [voiceA, setVoiceA] = useState<VoiceName>("Kore");
  const [voiceB, setVoiceB] = useState<VoiceName>("Puck");

  useEffect(() => {
    setSpeakerA(detected[0] ?? null);
    setSpeakerB(detected[1] ?? null);
  }, [detected]);

  // Output
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetAudio() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  }

  async function handleGenerate() {
    setLoading(true);
    resetAudio();
    try {
      const body: any = { text, format };
      if (format === "mp3") body.bitrateKbps = bitrate;

      if (mode === "multi") {
        if (!speakerA || !speakerB) throw new Error("Hãy chọn đủ 2 speakers.");
        if (speakerA === speakerB) throw new Error("Speaker A và B phải khác nhau.");
        if (voiceA === voiceB) throw new Error("Hai speakers cần 2 voices KHÁC nhau.");
        body.speakers = [
          { speaker: speakerA, voiceName: voiceA },
          { speaker: speakerB, voiceName: voiceB },
        ];
      } else {
        body.voiceName = singleVoice; // single voice
      }

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Request failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      alert(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* Title */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Gemini TTS — Single Voice & Multi-Speaker</h1>
       
      </header>

      {/* Mode switch */}
      <div className="mb-4 inline-flex overflow-hidden rounded-xl border border-gray-200 bg-white text-sm shadow-sm">
        <button
          onClick={() => setMode("single")}
          className={`px-4 py-2 ${mode === "single" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
        >
          Single voice
        </button>
        <button
          onClick={() => setMode("multi")}
          className={`border-l px-4 py-2 ${mode === "multi" ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
        >
          Multi-speaker
        </button>
      </div>

      {/* Script editor */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">Script</label>
        <textarea
          className="h-44 w-full resize-y rounded-xl border border-gray-300 bg-white p-3 text-sm leading-6 outline-none ring-1 ring-transparent placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-300"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          placeholder={mode === "multi" ? "Alice: Hello Bob!\nBob: Hi Alice!" : "Type any text to speak…"}
        />

        {/* Controls row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Single voice select */}
          {mode === "single" && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Voice</label>
              <select
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-gray-300"
                value={singleVoice}
                onChange={(e) => setSingleVoice(e.target.value as VoiceName)}
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          {/* Format */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Format</label>
            <select
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-gray-300"
              value={format}
              onChange={(e) => setFormat(e.target.value as AudioFormat)}
            >
              <option value="mp3">MP3</option>
              <option value="wav">WAV</option>
            </select>
          </div>

          {/* Bitrate (MP3 only) */}
          {format === "mp3" && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Bitrate</label>
              <input
                type="range"
                min={24}
                max={192}
                step={8}
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
                className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-gray-200"
              />
              <span className="tabular-nums text-sm text-gray-700">{bitrate} kbps</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {audioUrl && (
              <button
                onClick={() => { if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(null); }}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition active:scale-[0.99]"
              >
                Reset audio
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>
      </section>

      {/* Multi config: đúng 2 speakers & 2 voices */}
      {mode === "multi" && (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Multi-speaker</h2>
            <span className="text-xs text-gray-500">{detected.length} speaker(s) detected</span>
          </div>

          {detected.length < 2 ? (
            <p className="text-sm text-red-600">
              Cần ít nhất <b>2 dòng</b> theo mẫu <span className="font-mono">Name: câu nói</span>.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Speaker A */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 text-sm font-medium">Speaker A</div>
                <select
                  className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm"
                  value={speakerA ?? ""}
                  onChange={(e) => setSpeakerA(e.target.value)}
                >
                  {detected.map((s) => (
                    <option key={s} value={s} disabled={s === speakerB}>{s}</option>
                  ))}
                </select>
                <div className="text-sm text-gray-700">Voice</div>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm"
                  value={voiceA}
                  onChange={(e) => setVoiceA(e.target.value as VoiceName)}
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v} value={v} disabled={v === voiceB}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Speaker B */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 text-sm font-medium">Speaker B</div>
                <select
                  className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm"
                  value={speakerB ?? ""}
                  onChange={(e) => setSpeakerB(e.target.value)}
                >
                  {detected.map((s) => (
                    <option key={s} value={s} disabled={s === speakerA}>{s}</option>
                  ))}
                </select>
                <div className="text-sm text-gray-700">Voice</div>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm"
                  value={voiceB}
                  onChange={(e) => setVoiceB(e.target.value as VoiceName)}
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v} value={v} disabled={v === voiceA}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <p className="mt-2 text-xs text-gray-600">
            Yêu cầu của Gemini TTS (preview): <b>đúng 2 speakers</b> và <b>2 voices khác nhau</b>.
          </p>
        </section>
      )}

      {/* Output */}
      {audioUrl && (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-800">Output</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <audio src={audioUrl} controls className="w-full max-w-xl" />
            <a
              href={audioUrl}
              download={format === "wav" ? "gemini-tts.wav" : "gemini-tts.mp3"}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.99]"
            >
              Download {format.toUpperCase()}
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
