(function () {
  'use strict';

  /**
   * Developer responsibilities per Google's HTML/CSS Style Guide.
   * These are shown in the interactive header carousel.
   */
  const responsibilities = [
    'use https for external resources',
    'indent by 2 spaces',
    'use lowercase for elements, attributes, and class names',
    'remove trailing whitespace',
    'use utf-8 and <meta charset="utf-8">',
    'use semantic html for meaning, not presentation',
    'separate structure (html), presentation (css), and behavior (js)',
    'avoid html entities (\'&nbsp;\' etc); escape only < and &',
    'omit optional tags when it helps readability',
    'use hyphenated class names (e.g., .video-id)',
    'avoid id selectors; prefer classes',
    'prefer css shorthand properties',
    'omit units after 0 (e.g., margin: 0)',
    'always include leading 0s (e.g., 0.8em)',
    'prefer 3-digit hex where possible (#ebc)',
    'avoid !important; use specificity instead',
    'avoid ua detection and css hacks',
    'use a space after property colons',
    'end every declaration with a semicolon',
    'separate rules with a blank line',
    'use single quotes in css; no quotes in url()'
  ];

  /**
   * DOM refs
   */
  const screenEl = document.querySelector('.dp-convention-screen');
  const prevBtn = document.querySelector('.dp-btn-prev');
  const nextBtn = document.querySelector('.dp-btn-next');
  const playBtn = document.querySelector('.dp-btn-play');
  const yearEl = document.getElementById('year');
  const spotlightEl = document.querySelector('.dp-spotlight');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (!screenEl || !prevBtn || !nextBtn || !playBtn || !spotlightEl) {
    return; // missing expected elements; abort behavior
  }

  let currentIndex = 0;
  let autoplayIntervalId = null;
  const autoplayMs = 3000;

  function renderCurrentItem() {
    const text = responsibilities[currentIndex];
    // Replace content for screen readers via aria-live
    screenEl.innerHTML = '';
    const span = document.createElement('span');
    span.className = 'dp-convention-item';
    span.textContent = text;
    screenEl.appendChild(span);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % responsibilities.length;
    renderCurrentItem();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + responsibilities.length) % responsibilities.length;
    renderCurrentItem();
  }

  function isPlaying() {
    return autoplayIntervalId !== null;
  }

  function play() {
    if (isPlaying()) return;
    autoplayIntervalId = window.setInterval(showNext, autoplayMs);
    playBtn.setAttribute('aria-pressed', 'true');
    playBtn.textContent = 'pause';
  }

  function pause() {
    if (!isPlaying()) return;
    window.clearInterval(autoplayIntervalId);
    autoplayIntervalId = null;
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.textContent = 'play';
  }

  function togglePlay() {
    if (isPlaying()) {
      pause();
    } else {
      play();
    }
  }

  // Wire up events
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);
  playBtn.addEventListener('click', togglePlay);

  // Basic keyboard support for carousel controls
  document.addEventListener('keydown', function (e) {
    const key = e.key;
    if (key === 'ArrowRight') {
      showNext();
    } else if (key === 'ArrowLeft') {
      showPrev();
    } else if (key === ' ') {
      // prevent page scroll when toggling play/pause with Space
      e.preventDefault();
      togglePlay();
    }
  });

  const handleMouseMove = e => {
    const rect = spotlightEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlightEl.style.setProperty('--mouse-x', `${x}px`);
    spotlightEl.style.setProperty('--mouse-y', `${y}px`);
  };

  const registerMouseMove = () => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
  };
  const unregisterMouseMove = () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
  
  spotlightEl.parentElement.addEventListener('mouseenter', registerMouseMove);
  spotlightEl.parentElement.addEventListener('mouseleave', unregisterMouseMove);

  // Initial render
    renderCurrentItem();
  })();


