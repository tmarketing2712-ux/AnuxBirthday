/**
 * 🌸 ANU'S BIRTHDAY SURPRISE — CORE APPLICATION LOGIC
 * Manages animations, scrapbook interactions, gallery lightbox,
 * timeline, letter unfold, hidden surprise, and final screen.
 */

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.SITE_CONFIG;

  // Initialize Particles Engine
  const particles = new SurpriseParticlesEngine("celestial-canvas");

  // Initialize Audio Engine
  const audioEngine = new SurpriseAudioEngine(cfg);

  // Setup UI elements and content
  initOpeningScreen(cfg, audioEngine, particles);
  renderContent(cfg);
  initGallery(cfg);
  initLetterInteraction();
  initHiddenSurprise(cfg, audioEngine, particles);
  initFinalScreen(particles);
  initScrollAnimations(audioEngine);
  initPhotoSafetyHelper();
});

// ==========================================
// 1. OPENING SCREEN SEQUENCE
// ==========================================
function initOpeningScreen(cfg, audioEngine, particles) {
  const openingOverlay = document.getElementById("opening-screen");
  const step1 = document.getElementById("opening-step-1");
  const step2 = document.getElementById("opening-step-2");
  const step3 = document.getElementById("opening-step-3");
  const openBtn = document.getElementById("opening-btn");

  if (!openingOverlay) return;

  // Populate opening text from config
  if (step1) step1.textContent = cfg.opening.step1;
  if (step2) step2.textContent = cfg.opening.step2;
  if (step3) step3.textContent = cfg.opening.step3;
  if (openBtn) openBtn.innerHTML = `${cfg.opening.buttonText} <span class="sparkle-spark">✨</span>`;

  // Staggered cinematic reveal
  setTimeout(() => {
    if (step1) step1.classList.add("visible");
  }, 900);

  setTimeout(() => {
    if (step2) step2.classList.add("visible");
  }, 2600);

  setTimeout(() => {
    if (step3) step3.classList.add("visible");
  }, 4400);

  setTimeout(() => {
    if (openBtn) openBtn.classList.add("visible");
  }, 6200);

  // User clicks "Open Your Surprise ✨"
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      // Trigger celebratory particle burst
      const rect = openBtn.getBoundingClientRect();
      particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);

      // Start music softly
      audioEngine.play();

      // Cinematic fade-out
      openingOverlay.classList.add("unlocked");
      document.body.classList.remove("overflow-locked");

      setTimeout(() => {
        openingOverlay.style.display = "none";
      }, 1400);
    });
  }
}

// ==========================================
// 2. RENDER CONTENT FROM CONFIG
// ==========================================
function renderContent(cfg) {
  // Hero Content
  const heroGreeting = document.getElementById("hero-greeting");
  const heroSubGreeting = document.getElementById("hero-sub-greeting");
  const heroTagline = document.getElementById("hero-tagline");
  const heroSubText = document.getElementById("hero-sub-text");

  if (heroGreeting) heroGreeting.textContent = cfg.hero.greeting;
  if (heroSubGreeting) heroSubGreeting.textContent = cfg.hero.subGreeting;
  if (heroTagline) heroTagline.textContent = cfg.hero.tagline;
  if (heroSubText) heroSubText.textContent = cfg.hero.subText;

  // Timeline Heading
  const timelineHeading = document.getElementById("timeline-heading");
  const timelineSubtitle = document.getElementById("timeline-subtitle");
  const timelineQuote = document.getElementById("timeline-quote");
  if (timelineHeading) timelineHeading.textContent = cfg.timeline.sectionHeading;
  if (timelineSubtitle) timelineSubtitle.textContent = cfg.timeline.sectionSubtitle;
  if (timelineQuote) timelineQuote.textContent = `“${cfg.timeline.quote}”`;

  // Render Timeline Milestones
  const timelineList = document.getElementById("timeline-list");
  if (timelineList) {
    timelineList.innerHTML = "";
    cfg.timeline.milestones.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = `timeline-item ${idx % 2 === 0 ? "left" : "right"} fade-up`;
      card.innerHTML = `
        <div class="timeline-dot">
          <span class="dot-inner"></span>
        </div>
        <div class="scrapbook-card timeline-card">
          <div class="washi-tape top-center"></div>
          <span class="timeline-chapter-tag">${item.tag}</span>
          <h3 class="timeline-item-title">${item.title}</h3>
          <p class="timeline-item-desc">${item.description}</p>
        </div>
      `;
      timelineList.appendChild(card);
    });
  }

  // Qualities / "Things That Make You... You"
  const qualitiesHeading = document.getElementById("qualities-heading");
  const qualitiesSubtitle = document.getElementById("qualities-subtitle");
  if (qualitiesHeading) qualitiesHeading.textContent = cfg.qualities.sectionHeading;
  if (qualitiesSubtitle) qualitiesSubtitle.textContent = cfg.qualities.sectionSubtitle;

  const qualitiesGrid = document.getElementById("qualities-grid");
  if (qualitiesGrid) {
    qualitiesGrid.innerHTML = "";
    cfg.qualities.items.forEach((q, i) => {
      const card = document.createElement("div");
      card.className = "quality-card fade-up";
      card.innerHTML = `
        <div class="quality-card-inner">
          <div class="card-ornament">✦</div>
          <h3 class="quality-title">${q.title}</h3>
          <p class="quality-desc">“${q.description}”</p>
        </div>
      `;
      qualitiesGrid.appendChild(card);
    });
  }

  // Personal Letter Section
  const letterHeading = document.getElementById("letter-heading");
  const letterSalutation = document.getElementById("letter-salutation");
  const letterBody = document.getElementById("letter-body");
  const letterClosing = document.getElementById("letter-closing");
  const letterSignature = document.getElementById("letter-signature");

  if (letterHeading) letterHeading.textContent = cfg.letter.sectionHeading;
  if (letterSalutation) letterSalutation.textContent = cfg.letter.salutation;
  if (letterClosing) letterClosing.textContent = cfg.letter.closing;
  if (letterSignature) letterSignature.textContent = cfg.letter.signature;

  if (letterBody) {
    letterBody.innerHTML = "";
    cfg.letter.paragraphs.forEach(p => {
      const pTag = document.createElement("p");
      pTag.textContent = `“${p}”`;
      letterBody.appendChild(pTag);
    });
  }

  // Hidden Surprise Teaser
  const surpriseTeaserTitle = document.getElementById("surprise-teaser-title");
  const surpriseTeaserSub = document.getElementById("surprise-teaser-sub");
  const surpriseBtn = document.getElementById("surprise-btn");

  if (surpriseTeaserTitle) surpriseTeaserTitle.textContent = cfg.hiddenSurprise.teaserTitle;
  if (surpriseTeaserSub) surpriseTeaserSub.textContent = `“${cfg.hiddenSurprise.teaserSubtitle}”`;
  if (surpriseBtn) surpriseBtn.textContent = cfg.hiddenSurprise.buttonText;

  // Final Minimal Screen Content
  const finalHeading = document.getElementById("final-heading");
  const finalLine1 = document.getElementById("final-line-1");
  const finalLine2 = document.getElementById("final-line-2");
  const finalWish = document.getElementById("final-wish");
  const finalSign = document.getElementById("final-sign");

  if (finalHeading) finalHeading.textContent = cfg.finalScreen.mainHeading;
  if (finalLine1) finalLine1.textContent = `“${cfg.finalScreen.line1}”`;
  if (finalLine2) finalLine2.textContent = `“${cfg.finalScreen.line2}”`;
  if (finalWish) finalWish.textContent = cfg.finalScreen.closingWish;
  if (finalSign) finalSign.textContent = cfg.finalScreen.signature;
}

// ==========================================
// 3. PHOTO GALLERY & LIGHTBOX
// ==========================================
function initGallery(cfg) {
  const galleryGrid = document.getElementById("gallery-grid");
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const lightbox = document.getElementById("photo-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxDate = document.getElementById("lightbox-date");
  const lightboxClose = document.getElementById("lightbox-close");

  let currentCategory = "all";

  const renderPhotos = () => {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = "";

    const filtered = cfg.gallery.photos.filter(p => {
      if (currentCategory === "all") return true;
      return p.category === currentCategory;
    });

    filtered.forEach((photo, idx) => {
      const item = document.createElement("div");
      item.className = `polaroid-card fade-up ${photo.category}`;
      item.setAttribute("data-id", photo.id);

      // Subtle random tilt for authentic scrapbook feel (-3 to +3 deg)
      const tilt = ((idx % 3) - 1) * 2.2;
      item.style.setProperty("--tilt-angle", `${tilt}deg`);

      // Check stored custom local image or configured src
      const storedSrc = localStorage.getItem(`anu_photo_${photo.id}`) || photo.src;

      item.innerHTML = `
        <div class="washi-tape top-center"></div>
        <div class="polaroid-photo-wrapper">
          <img 
            src="${storedSrc}" 
            alt="${photo.alt}" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${photo.fallbackSvg}'" 
            class="polaroid-img"
          />
          <div class="photo-overlay-glass">
            <span class="zoom-hint">✨ View Memory</span>
          </div>
        </div>
        <div class="polaroid-caption-area">
          <h4 class="polaroid-title">${photo.title}</h4>
          <p class="polaroid-caption">“${photo.caption}”</p>
          <span class="polaroid-date">${photo.date}</span>
        </div>
      `;

      item.addEventListener("click", () => openLightbox(photo, storedSrc));
      galleryGrid.appendChild(item);
    });
  };

  const openLightbox = (photo, activeSrc) => {
    if (!lightbox) return;
    lightboxImg.src = activeSrc;
    lightboxImg.onerror = () => { lightboxImg.src = photo.fallbackSvg; };
    lightboxTitle.textContent = photo.title;
    lightboxCaption.textContent = `“${photo.caption}”`;
    lightboxDate.textContent = photo.date;
    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      renderPhotos();
    });
  });

  renderPhotos();
}

// ==========================================
// 4. PERSONAL LETTER INTERACTION
// ==========================================
function initLetterInteraction() {
  const seal = document.getElementById("wax-seal");
  const letterCard = document.getElementById("personal-letter-card");
  const sealHint = document.getElementById("seal-hint");

  if (!seal || !letterCard) return;

  seal.addEventListener("click", () => {
    seal.classList.add("broken");
    letterCard.classList.add("unfolded");
    if (sealHint) sealHint.style.display = "none";
  });
}

// ==========================================
// 5. HIDDEN SURPRISE & CINEMATIC TRANSITION
// ==========================================
function initHiddenSurprise(cfg, audioEngine, particles) {
  const surpriseBtn = document.getElementById("surprise-btn");
  const cinematicModal = document.getElementById("surprise-cinematic-modal");
  const surpriseLinesContainer = document.getElementById("cinematic-lines-container");
  const modalCloseBtn = document.getElementById("cinematic-close-btn");

  if (!surpriseBtn || !cinematicModal) return;

  surpriseBtn.addEventListener("click", (e) => {
    const rect = surpriseBtn.getBoundingClientRect();
    particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);

    // Switch music automatically to Ilahi for celebratory crescendo
    audioEngine.syncWithSection("surprise");

    // Open Cinematic reveal overlay
    cinematicModal.classList.add("active");
    document.body.classList.add("overflow-locked");

    // Populate lines with dramatic delays
    if (surpriseLinesContainer) {
      surpriseLinesContainer.innerHTML = "";
      const msg = cfg.hiddenSurprise.cinematicMessage;

      const salutation = document.createElement("div");
      salutation.className = "cinematic-line salutation";
      salutation.textContent = msg.salutation;
      surpriseLinesContainer.appendChild(salutation);

      const lineElements = [];
      msg.lines.forEach((lineText) => {
        const p = document.createElement("div");
        p.className = "cinematic-line quote";
        p.textContent = `“${lineText}”`;
        surpriseLinesContainer.appendChild(p);
        lineElements.push(p);
      });

      const wish = document.createElement("div");
      wish.className = "cinematic-line birthday-wish";
      wish.textContent = msg.birthdayWish;
      surpriseLinesContainer.appendChild(wish);

      const sign = document.createElement("div");
      sign.className = "cinematic-line signature";
      sign.textContent = msg.signOff;
      surpriseLinesContainer.appendChild(sign);

      // Staggered reveals
      setTimeout(() => salutation.classList.add("visible"), 800);

      lineElements.forEach((el, index) => {
        setTimeout(() => el.classList.add("visible"), 2400 + (index * 2200));
      });

      const totalDelay = 2400 + (lineElements.length * 2200);
      setTimeout(() => wish.classList.add("visible"), totalDelay + 800);
      setTimeout(() => sign.classList.add("visible"), totalDelay + 2200);

      // Reveal proceed to final screen button
      setTimeout(() => {
        if (modalCloseBtn) modalCloseBtn.classList.add("visible");
      }, totalDelay + 3400);
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      cinematicModal.classList.remove("active");
      document.body.classList.remove("overflow-locked");

      // Smooth scroll to the final screen
      const finalSection = document.getElementById("final-screen-section");
      if (finalSection) {
        finalSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

// ==========================================
// 6. FINAL SCREEN & WISH CANDLE
// ==========================================
function initFinalScreen(particles) {
  const wishBtn = document.getElementById("make-wish-btn");
  const candleFlame = document.getElementById("candle-flame");
  const wishMessage = document.getElementById("wish-message-pop");

  if (wishBtn) {
    wishBtn.addEventListener("click", (e) => {
      const rect = wishBtn.getBoundingClientRect();
      particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

      if (candleFlame) candleFlame.classList.add("extinguished");
      if (wishMessage) {
        wishMessage.textContent = "✨ May every single wish you make today come true, Anu.";
        wishMessage.classList.add("revealed");
      }
      wishBtn.disabled = true;
      wishBtn.innerHTML = `<span>Wish Sent to the Stars ✨</span>`;
    });
  }
}

// ==========================================
// 7. SCROLL OBSERVER & AUTO SECTION SYNC
// ==========================================
function initScrollAnimations(audioEngine) {
  // Fade-up animation observer
  const fadeElements = document.querySelectorAll(".fade-up");
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // Section soundtrack synchronizer observer
  const sections = document.querySelectorAll("section[data-soundtrack]");
  const soundtrackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const soundtrackName = entry.target.getAttribute("data-soundtrack");
        if (soundtrackName) {
          audioEngine.syncWithSection(soundtrackName);
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => soundtrackObserver.observe(s));
}

// ==========================================
// 8. PRIVACY-SAFE PHOTO HELPER
// Allows Pari to test actual photos locally
// and strips EXIF/GPS metadata via canvas
// ==========================================
function initPhotoSafetyHelper() {
  const helperToggle = document.getElementById("photo-helper-toggle");
  const helperModal = document.getElementById("photo-helper-modal");
  const helperClose = document.getElementById("photo-helper-close");
  const clearPhotosBtn = document.getElementById("clear-stored-photos-btn");

  if (helperToggle && helperModal) {
    helperToggle.addEventListener("click", () => helperModal.classList.add("active"));
  }
  if (helperClose && helperModal) {
    helperClose.addEventListener("click", () => helperModal.classList.remove("active"));
  }

  // Handle local photo slot uploads with EXIF strip
  [1, 2, 3, 4].forEach(num => {
    const input = document.getElementById(`upload-slot-${num}`);
    if (!input) return;

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Draw to canvas to strip EXIF/GPS/device metadata completely
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // Export sanitized data URL
          const sanitizedUrl = canvas.toDataURL("image/jpeg", 0.92);
          try {
            localStorage.setItem(`anu_photo_${num}`, sanitizedUrl);
            const statusTag = document.getElementById(`slot-status-${num}`);
            if (statusTag) statusTag.textContent = "✅ Custom photo applied!";
          } catch (err) {
            console.warn("Local storage size limit exceeded, photo preview active in session");
          }

          // Refresh gallery view
          initGallery(window.SITE_CONFIG);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  });

  if (clearPhotosBtn) {
    clearPhotosBtn.addEventListener("click", () => {
      [1, 2, 3, 4].forEach(num => localStorage.removeItem(`anu_photo_${num}`));
      initGallery(window.SITE_CONFIG);
      alert("Photos reset to default scrapbook illustrations.");
    });
  }
}
