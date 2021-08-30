const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);

export function playTone(freq, duration = 500, volume = 0.25, type = 'square') {
  masterGainNode.gain.value = volume;
  const osc = audioContext.createOscillator();
  osc.connect(masterGainNode);
  osc.type = type;
  osc.frequency.value = freq;
  osc.start();

  return new Promise(res => {
    setTimeout(() => {
      osc.stop();
      res();
    }, duration);
  });
}

export function playStartsound() {
  return playTone(300, 200).then(() => playTone(500, 100));
}

export function playGameOversound() {
  return playTone(300, 150)
    .then(() => playTone(250, 200))
    .then(() => playTone(150, 250));
}

export function playWonTune() {
  return playTone(440, 100)
    .then(() => playTone(0, 50))
    .then(() => playTone(440, 100))
    .then(() => playTone(0, 50))
    .then(() => playTone(400, 100))
    .then(() => playTone(0, 50))
    .then(() => playTone(700, 300));
}

export function playLooseTune() {
  return playTone(300, 400)
    .then(() => playTone(0, 100))
    .then(() => playTone(300, 400))
    .then(() => playTone(250, 200))
    .then(() => playTone(100, 250));
}

const noteFreqMap = {
  A: 440.00,
  B: 493.88,
  C: 523.25,
  D: 369.99,
  E: 329.63,
  F: 349.23,
  G: 392.00,
}

let play = true
export async function playTune(feqIndex = 1, time = 200) {
  const volume = 0.05;
  const type = 'sawtooth'
  const frequencies = [0.25, 0.5, 1, 2, 2.25]
  const freq = frequencies[Math.round(Math.random() * (frequencies.length - 1))]
  await playTone(noteFreqMap.A * freq, time * 4, volume, type)
  await playTone(0, time * 0.25)
  await playTone(noteFreqMap.C * freq, time * 2, volume, type)
  await playTone(0, time * 0.25)
  await playTone(noteFreqMap.G * freq, time * 2, volume, type)
  await playTone(0, time * 0.25)
  await playTone(noteFreqMap.F * freq, time * 1, volume, type)
  await playTone(0, time * 0.25)
  await playTone(noteFreqMap.G * freq, time * 1, volume, type)
  await playTone(0, time * 0.25)
  await playTone(noteFreqMap.A * freq, time * 1, volume, type)
  await playTone(0, time * 0.25)
  await playTone(noteFreqMap.A * freq, time * 1, volume, type)
  await playTone(0, time * 4)
  play && playTune(feqIndex < frequencies.length ? ++feqIndex : 0, time)
}
export function stopTune() {
  play = false
}
