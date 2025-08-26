export const AudioFormat = {
    mp3: 'mp3',
    wav: 'wav'
} as const

// Mảng values (["mp3", "wav"])
export const AudioFormatValues = Object.values(AudioFormat);

// Union type ("mp3" | "wav")
export type AudioFormatType = (typeof AudioFormatValues)[number];