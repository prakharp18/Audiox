import lamejs from "lamejs";

export async function convertWebmToMp3(webmBlob: Blob): Promise<Blob> {
  const arrayBuffer = await webmBlob.arrayBuffer();

  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.getChannelData(0);

  const mp3Encoder = new lamejs.Mp3Encoder(
    numberOfChannels === 1 ? 1 : 2,
    sampleRate,
    128
  );

  const sampleBlockSize = 1152;
  const mp3Data: Uint8Array[] = [];

  const samples16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    samples16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  let samples16Right: Int16Array | undefined;
  if (numberOfChannels === 2) {
    const rightChannel = audioBuffer.getChannelData(1);
    samples16Right = new Int16Array(rightChannel.length);
    for (let i = 0; i < rightChannel.length; i++) {
      const s = Math.max(-1, Math.min(1, rightChannel[i]));
      samples16Right[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }

  for (let i = 0; i < samples16.length; i += sampleBlockSize) {
    const leftChunk = samples16.subarray(i, i + sampleBlockSize);

    let mp3buf: Uint8Array;
    if (numberOfChannels === 2 && samples16Right) {
      const rightChunk = samples16Right.subarray(i, i + sampleBlockSize);
      mp3buf = new Uint8Array(mp3Encoder.encodeBuffer(leftChunk, rightChunk));
    } else {
      mp3buf = new Uint8Array(mp3Encoder.encodeBuffer(leftChunk));
    }

    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const end = new Uint8Array(mp3Encoder.flush());
  if (end.length > 0) {
    mp3Data.push(end);
  }

  await audioContext.close();

  return new Blob(mp3Data as BlobPart[], { type: "audio/mpeg" });
}
