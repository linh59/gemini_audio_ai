import { Mp3Encoder } from "@breezystack/lamejs";

const PCM_SAMPLE_RATE = 24000; // Gemini TTS trả PCM 16-bit, mono, 24kHz
const PCM_CHANNELS = 1;
const PCM_BITS = 16;

const MP3_KBPS_DEFAULT = 64; // 64 kbps đủ rõ cho giọng nói
const MP3_KBPS_MIN = 24;
const MP3_KBPS_MAX = 192;


// Giới hạn bitrate về khoảng 24..192
export function clampBitrate(kbps?: number): number {
  const v = typeof kbps === "number" ? kbps : MP3_KBPS_DEFAULT;
  return Math.min(MP3_KBPS_MAX, Math.max(MP3_KBPS_MIN, v));
}

/* ===== PCM (Buffer) -> WAV (Buffer) =====
   WAV là PCM + header 44 byte. Trình duyệt phát được ngay. */
export function pcmToWav(pcm: Buffer): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = (PCM_SAMPLE_RATE * PCM_CHANNELS * PCM_BITS) / 8;
  const blockAlign = (PCM_CHANNELS * PCM_BITS) / 8;
  const dataSize = pcm.length;
  const chunkSize = 36 + dataSize;

  header.write("RIFF", 0);
  header.writeUInt32LE(chunkSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);           // Subchunk1Size
  header.writeUInt16LE(1, 20);            // AudioFormat = 1 (PCM)
  header.writeUInt16LE(PCM_CHANNELS, 22); // NumChannels
  header.writeUInt32LE(PCM_SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(PCM_BITS, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcm]);
}

/* ===== PCM (Buffer) -> MP3 (Buffer) =====
   Dùng @breezystack/lamejs để encode MP3 mono 24kHz. */
export function pcmToMp3(pcm: Buffer, kbps: number): Buffer {
  const FRAME = 1152; // kích thước khung chuẩn cho lamejs
  // LameJS cần Int16Array (mỗi mẫu là 16 bit)
  const pcmI16 = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 2);

  const encoder = new Mp3Encoder(PCM_CHANNELS, PCM_SAMPLE_RATE, kbps);
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < pcmI16.length; i += FRAME) {
    const slice = pcmI16.subarray(i, i + FRAME);
    const buf = encoder.encodeBuffer(slice);
    if (buf.length) chunks.push(buf);
  }
  const end = encoder.flush();
  if (end.length) chunks.push(end);

  // Gộp các mảnh MP3 thành một Buffer duy nhất
  const total = chunks.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of chunks) { out.set(a, off); off += a.length; }
  return Buffer.from(out);
}