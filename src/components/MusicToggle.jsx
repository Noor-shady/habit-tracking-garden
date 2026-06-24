import { Music, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  function playSoftTone() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 432 + Math.random() * 80;
    gain.gain.value = 0.025;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.45);
  }

  function toggleMusic() {
    if (playing) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPlaying(false);
      return;
    }

    playSoftTone();
    intervalRef.current = setInterval(playSoftTone, 1400);
    setPlaying(true);
  }

  return (
    <button className="music-toggle" onClick={toggleMusic}>
      {playing ? <VolumeX size={18} /> : <Music size={18} />}
      {playing ? "Pause ambience" : "Play ambience"}
    </button>
  );
}
