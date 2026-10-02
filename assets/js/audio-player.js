/**
 * 🎵 SMART SOUNDTRACK ENGINE & FLOATING PLAYER
 * Supports custom audio files (Woh Din, Iktara, Ilahi, Ambient)
 * with a high-fidelity Web Audio API fallback synthesizer so it plays
 * beautiful music immediately out of the box even before MP3s are added!
 */

class SurpriseAudioEngine {
  constructor(config) {
    this.config = config.music;
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.65;
    this.audioElement = new Audio();
    this.audioElement.preload = "metadata";
    this.audioElement.volume = this.volume;
    
    // Auto-section sync flag
    this.isAutoSync = true;
    this.currentSection = "opening";
    
    // Web Audio Synthesizer fallback
    this.audioCtx = null;
    this.synthInterval = null;
    this.isSynthesizing = false;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.playerWidget = document.getElementById("music-player");
    this.playBtn = document.getElementById("mp-play-btn");
    this.trackTitle = document.getElementById("mp-track-title");
    this.trackDesc = document.getElementById("mp-track-desc");
    this.progressBar = document.getElementById("mp-progress-bar");
    this.progressFill = document.getElementById("mp-progress-fill");
    this.volumeSlider = document.getElementById("mp-volume-slider");
    this.muteBtn = document.getElementById("mp-mute-btn");
    this.trackListContainer = document.getElementById("mp-track-list");
    this.autoSyncBadge = document.getElementById("mp-autosync-badge");
    this.togglePlayerBtn = document.getElementById("mp-toggle-btn");

    this.renderTrackList();
    this.updateTrackInfo();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  renderTrackList() {
    if (!this.trackListContainer) return;
    this.trackListContainer.innerHTML = "";

    this.config.tracks.forEach((track, index) => {
      const btn = document.createElement("button");
      btn.className = `mp-track-item ${index === this.currentTrackIndex ? "active" : ""}`;
      btn.innerHTML = `
        <span class="track-num">0${index + 1}</span>
        <div class="track-meta">
          <span class="track-name">${track.title}</span>
          <span class="track-sub">${track.desc}</span>
        </div>
        <span class="track-tag">${track.section}</span>
      `;
      btn.addEventListener("click", () => {
        this.isAutoSync = false;
        this.updateAutoSyncUI();
        this.selectTrack(index, true);
      });
      this.trackListContainer.appendChild(btn);
    });
  }

  updateTrackInfo() {
    const track = this.config.tracks[this.currentTrackIndex];
    if (!track) return;

    if (this.trackTitle) this.trackTitle.textContent = track.title;
    if (this.trackDesc) this.trackDesc.textContent = track.desc;

    // Update active highlight in list
    if (this.trackListContainer) {
      const items = this.trackListContainer.querySelectorAll(".mp-track-item");
      items.forEach((item, idx) => {
        item.classList.toggle("active", idx === this.currentTrackIndex);
      });
    }

    // Update disc rotation & badge
    const disc = document.querySelector(".mp-disc-icon");
    if (disc) {
      if (this.isPlaying) {
        disc.classList.add("spinning");
      } else {
        disc.classList.remove("spinning");
      }
    }
  }

  selectTrack(index, autoPlay = false) {
    if (index < 0 || index >= this.config.tracks.length) return;
    this.currentTrackIndex = index;
    const track = this.config.tracks[index];

    this.stopSynthesizer();
    this.audioElement.pause();

    // Set file path
    this.audioElement.src = track.file;
    this.updateTrackInfo();

    if (autoPlay) {
      this.play();
    }
  }

  play() {
    this.initAudioContext();
    this.isPlaying = true;
    this.updatePlayBtnUI();
    this.updateTrackInfo();

    const track = this.config.tracks[this.currentTrackIndex];

    // Attempt HTML5 audio file playback
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Successfully playing actual audio file
          this.stopSynthesizer();
        })
        .catch(() => {
          // Try alternate extension (.m4a <-> .mp3) before synthesizer fallback
          const curSrc = this.audioElement.src;
          const altFile = track.file.endsWith(".m4a")
            ? track.file.replace(".m4a", ".mp3")
            : track.file.replace(".mp3", ".m4a");

          if (!curSrc.endsWith(altFile)) {
            this.audioElement.src = altFile;
            this.audioElement.play()
              .then(() => this.stopSynthesizer())
              .catch(() => this.startSynthesizer(track.synthMood));
          } else {
            this.startSynthesizer(track.synthMood);
          }
        });
    } else {
      this.startSynthesizer(track.synthMood);
    }
  }

  pause() {
    this.isPlaying = false;
    this.audioElement.pause();
    this.stopSynthesizer();
    this.updatePlayBtnUI();
    this.updateTrackInfo();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(val) {
    this.volume = parseFloat(val);
    this.audioElement.volume = this.volume;
    if (this.synthMasterGain) {
      this.synthMasterGain.gain.setValueAtTime(this.volume * 0.15, this.audioCtx.currentTime);
    }
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.muted = this.isMuted;
    if (this.synthMasterGain) {
      this.synthMasterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume * 0.15,
        this.audioCtx.currentTime
      );
    }
    if (this.muteBtn) {
      this.muteBtn.innerHTML = this.isMuted
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    }
  }

  updatePlayBtnUI() {
    if (!this.playBtn) return;
    this.playBtn.innerHTML = this.isPlaying
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
  }

  updateAutoSyncUI() {
    if (this.autoSyncBadge) {
      this.autoSyncBadge.textContent = this.isAutoSync ? "Auto Sync: ON" : "Manual Mode";
      this.autoSyncBadge.classList.toggle("manual", !this.isAutoSync);
    }
  }

  // Called when scrolling through sections
  syncWithSection(sectionName) {
    if (!this.isAutoSync) return;
    this.currentSection = sectionName;

    let targetIndex = -1;
    if (sectionName === "timeline") {
      targetIndex = this.config.tracks.findIndex(t => t.id === "wohdin");
    } else if (sectionName === "gallery" || sectionName === "qualities") {
      targetIndex = this.config.tracks.findIndex(t => t.id === "iktara");
    } else if (sectionName === "letter") {
      targetIndex = this.config.tracks.findIndex(t => t.id === "ambient");
    } else if (sectionName === "surprise" || sectionName === "final") {
      targetIndex = this.config.tracks.findIndex(t => t.id === "ilahi");
    }

    if (targetIndex !== -1 && targetIndex !== this.currentTrackIndex) {
      this.selectTrack(targetIndex, this.isPlaying);
    }

    // Soft, low-volume background during personal letter as specified
    if (sectionName === "letter") {
      this.setVolume(0.28);
    } else if (this.volume < 0.45) {
      this.setVolume(0.65);
    }
  }

  // ==========================================
  // 🎹 WEB AUDIO API AMBIENT SYNTHESIZER
  // Generates soothing acoustic/piano harmonies
  // matching each song's nostalgic mood
  // ==========================================
  startSynthesizer(mood = "nostalgic") {
    if (this.isSynthesizing) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    this.isSynthesizing = true;

    // Master synthesizer gain
    this.synthMasterGain = this.audioCtx.createGain();
    this.synthMasterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.14, this.audioCtx.currentTime);
    this.synthMasterGain.connect(this.audioCtx.destination);

    // Warm Low-pass filter for soft acoustic warmth
    this.synthFilter = this.audioCtx.createBiquadFilter();
    this.synthFilter.type = "lowpass";
    this.synthFilter.frequency.setValueAtTime(850, this.audioCtx.currentTime);
    this.synthFilter.connect(this.synthMasterGain);

    // Scale notes by mood (frequencies in Hz)
    const moodScales = {
      // Woh Din: G major warm acoustic chord progression (G - Em - C - D)
      nostalgic: [
        [196.00, 246.94, 293.66, 392.00], // G
        [164.81, 196.00, 246.94, 329.63], // Em
        [130.81, 164.81, 196.00, 261.63], // C
        [146.83, 185.00, 220.00, 293.66]  // D
      ],
      // Iktara: Soulful D major acoustic & bell chords (D - A - Bm - G)
      dreamy: [
        [146.83, 220.00, 293.66, 369.99], // D
        [110.00, 164.81, 220.00, 277.18], // A
        [123.47, 146.83, 220.00, 246.94], // Bm
        [98.00, 146.83, 196.00, 246.94]   // G
      ],
      // Ambient: Very soft, warm, gentle floating pad (F - C - Dm - Bb)
      warm: [
        [174.61, 220.00, 261.63, 349.23], // F
        [130.81, 196.00, 261.63, 329.63], // C
        [146.83, 174.61, 220.00, 293.66], // Dm
        [116.54, 146.83, 174.61, 233.08]  // Bb
      ],
      // Ilahi: Uplifting, vibrant C major arpeggio groove (C - G - Am - F)
      uplifting: [
        [130.81, 196.00, 261.63, 329.63, 523.25], // C
        [98.00, 146.83, 196.00, 246.94, 392.00],  // G
        [110.00, 164.81, 220.00, 261.63, 440.00], // Am
        [87.31, 130.81, 174.61, 220.00, 349.23]   // F
      ]
    };

    const chords = moodScales[mood] || moodScales.nostalgic;
    let chordIndex = 0;
    let noteIndex = 0;

    const playChime = () => {
      if (!this.isSynthesizing || !this.audioCtx) return;

      const currentChord = chords[chordIndex];
      const freq = currentChord[noteIndex % currentChord.length];

      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      // Triangle/Sine mix for sweet acoustic bell tone
      osc.type = mood === "uplifting" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      const duration = mood === "uplifting" ? 0.75 : 1.6;

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.6, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.synthFilter);

      osc.start(now);
      osc.stop(now + duration + 0.1);

      noteIndex++;
      if (noteIndex >= currentChord.length) {
        noteIndex = 0;
        chordIndex = (chordIndex + 1) % chords.length;
      }
    };

    const intervalTime = mood === "uplifting" ? 420 : 680;
    this.synthInterval = setInterval(playChime, intervalTime);
    playChime();
  }

  stopSynthesizer() {
    this.isSynthesizing = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  bindEvents() {
    // Play button
    if (this.playBtn) {
      this.playBtn.addEventListener("click", () => this.togglePlay());
    }

    // Toggle player expand / collapse
    if (this.togglePlayerBtn) {
      this.togglePlayerBtn.addEventListener("click", () => {
        this.playerWidget.classList.toggle("collapsed");
      });
    }

    // Progress bar update
    this.audioElement.addEventListener("timeupdate", () => {
      if (this.audioElement.duration && this.progressFill) {
        const pct = (this.audioElement.currentTime / this.audioElement.duration) * 100;
        this.progressFill.style.width = `${pct}%`;
      }
    });

    // When a song ends, automatically advance to next track
    this.audioElement.addEventListener("ended", () => {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.config.tracks.length;
      this.selectTrack(this.currentTrackIndex, true);
    });

    // Volume Slider
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener("input", (e) => this.setVolume(e.target.value));
    }

    // Mute Button
    if (this.muteBtn) {
      this.muteBtn.addEventListener("click", () => this.toggleMute());
    }

    // Auto Sync button
    if (this.autoSyncBadge) {
      this.autoSyncBadge.addEventListener("click", () => {
        this.isAutoSync = !this.isAutoSync;
        this.updateAutoSyncUI();
        if (this.isAutoSync) {
          this.syncWithSection(this.currentSection);
        }
      });
    }

    // Local file selector: Pari can test his own MP3 files immediately!
    const localAudioInput = document.getElementById("mp-local-audio-input");
    if (localAudioInput) {
      localAudioInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          this.stopSynthesizer();
          this.audioElement.src = url;
          if (this.trackTitle) this.trackTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
          if (this.trackDesc) this.trackDesc.textContent = "Custom local track";
          this.play();
        }
      });
    }
  }
}

window.SurpriseAudioEngine = SurpriseAudioEngine;
