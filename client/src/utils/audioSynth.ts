/**
 * Web Audio API Synthesizer for Vietnamese Pentatonic Folk Melodies
 * (Quan họ Bắc Ninh traditional scales: C D F G A / Hò Xự Xang Xê Cống)
 */

interface Note {
  freq: number;
  dur: number;
}

// Pentatonic frequencies in Hz
const PENTATONIC: Record<string, number> = {
  'C4': 261.63, 'D4': 293.66, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
  'C5': 523.25, 'D5': 587.33, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00,
  'C6': 1046.50
};

// "Cây Trúc Xinh" melody
const CAY_TRUC_XINH: Note[] = [
  { freq: PENTATONIC['G4'], dur: 0.4 },
  { freq: PENTATONIC['A4'], dur: 0.4 },
  { freq: PENTATONIC['C5'], dur: 0.8 },
  { freq: PENTATONIC['D5'], dur: 0.4 },
  { freq: PENTATONIC['C5'], dur: 0.4 },
  { freq: PENTATONIC['A4'], dur: 0.8 },
  { freq: PENTATONIC['G4'], dur: 0.4 },
  { freq: PENTATONIC['A4'], dur: 0.4 },
  { freq: PENTATONIC['F4'], dur: 0.8 },
  { freq: PENTATONIC['G4'], dur: 0.8 },
  { freq: PENTATONIC['C5'], dur: 0.6 },
  { freq: PENTATONIC['D5'], dur: 0.6 },
  { freq: PENTATONIC['F5'], dur: 0.8 },
  { freq: PENTATONIC['D5'], dur: 0.4 },
  { freq: PENTATONIC['C5'], dur: 0.8 }
];

// "Khách Đến Chơi Nhà" melody
const KHACH_DEN_CHOI_NHA: Note[] = [
  { freq: PENTATONIC['C5'], dur: 0.5 },
  { freq: PENTATONIC['D5'], dur: 0.5 },
  { freq: PENTATONIC['C5'], dur: 0.5 },
  { freq: PENTATONIC['A4'], dur: 0.5 },
  { freq: PENTATONIC['G4'], dur: 1.0 },
  { freq: PENTATONIC['A4'], dur: 0.5 },
  { freq: PENTATONIC['C5'], dur: 0.5 },
  { freq: PENTATONIC['D5'], dur: 1.0 },
  { freq: PENTATONIC['F5'], dur: 0.5 },
  { freq: PENTATONIC['D5'], dur: 0.5 },
  { freq: PENTATONIC['C5'], dur: 0.5 },
  { freq: PENTATONIC['A4'], dur: 0.5 },
  { freq: PENTATONIC['G4'], dur: 1.2 }
];

// "Bèo Dạt Mây Trôi" melody
const BEO_DAT_MAY_TROI: Note[] = [
  { freq: PENTATONIC['A4'], dur: 0.6 },
  { freq: PENTATONIC['C5'], dur: 0.6 },
  { freq: PENTATONIC['D5'], dur: 1.0 },
  { freq: PENTATONIC['F5'], dur: 0.6 },
  { freq: PENTATONIC['D5'], dur: 0.6 },
  { freq: PENTATONIC['C5'], dur: 1.2 },
  { freq: PENTATONIC['A4'], dur: 0.6 },
  { freq: PENTATONIC['G4'], dur: 0.6 },
  { freq: PENTATONIC['F4'], dur: 1.0 },
  { freq: PENTATONIC['G4'], dur: 0.6 },
  { freq: PENTATONIC['A4'], dur: 0.6 },
  { freq: PENTATONIC['C5'], dur: 1.4 }
];

class AudioController {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private currentTrackName = '';
  private onStateChange: ((playing: boolean, trackName: string, progress: number) => void) | null = null;
  private progressInterval: number | null = null;
  private trackStartTime = 0;
  private trackDuration = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setListener(cb: (playing: boolean, trackName: string, progress: number) => void) {
    this.onStateChange = cb;
  }

  public playTrack(trackName: string) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrackName = trackName;

    let melody = CAY_TRUC_XINH;
    if (trackName.includes('Khách') || trackName.includes('Hội Lim')) {
      melody = KHACH_DEN_CHOI_NHA;
    } else if (trackName.includes('Bèo') || trackName.includes('Giã bạn') || trackName.includes('Nhớ')) {
      melody = BEO_DAT_MAY_TROI;
    }

    const totalDuration = melody.reduce((acc, n) => acc + n.dur, 0);
    this.trackDuration = totalDuration;
    this.trackStartTime = Date.now();

    let offset = 0;
    const now = this.ctx.currentTime + 0.05;

    melody.forEach((note) => {
      this.playPluckedString(note.freq, now + offset, note.dur);
      offset += note.dur;
    });

    if (this.onStateChange) {
      this.onStateChange(true, trackName, 0);
    }

    // Progress tick
    this.progressInterval = window.setInterval(() => {
      if (!this.isPlaying) return;
      const elapsed = (Date.now() - this.trackStartTime) / 1000;
      const percent = Math.min(100, (elapsed / this.trackDuration) * 100);
      if (this.onStateChange) {
        this.onStateChange(true, this.currentTrackName, percent);
      }
    }, 100);

    // Auto loop / complete
    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        // loop softly
        this.playTrack(trackName);
      }
    }, totalDuration * 1000 + 400);
  }

  private playPluckedString(freq: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    // Harmonic layer 1: Fundamental Sine / Triangle (Warm bamboo flute / Dan bau)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Subtle pitch vibrato/slide for traditional singing effect
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.008, startTime + 0.1);
    osc1.frequency.exponentialRampToValueAtTime(freq, startTime + 0.25);

    gain1.gain.setValueAtTime(0.001, startTime);
    gain1.gain.linearRampToValueAtTime(0.3, startTime + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Harmonic layer 2: Dan Tranh pluck (high harmonics with quick decay)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    gain2.gain.setValueAtTime(0.15, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

    // Filter to warm up sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, startTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(this.ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.onStateChange) {
      this.onStateChange(false, this.currentTrackName, 0);
    }
  }

  public toggle(trackName: string) {
    if (this.isPlaying && this.currentTrackName === trackName) {
      this.stop();
    } else {
      this.playTrack(trackName);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrackName
    };
  }
}

export const audioPlayer = new AudioController();
