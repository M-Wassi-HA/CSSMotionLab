/* ==========================================================================
   CSSMotionLab - CSS Effects & Animation Generator
   File: script.js (Vanilla JavaScript - Event Handlers & Dynamic CSS Engines)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initToast();

  // Route/Page-specific initialization based on page DOM elements
  if (document.getElementById('anim-generator')) initAnimationGenerator();
  if (document.getElementById('button-generator')) initButtonGenerator();
  if (document.getElementById('gradient-generator')) initGradientGenerator();
  if (document.getElementById('shadow-generator')) initShadowGenerator();
  if (document.getElementById('radius-generator')) initRadiusGenerator();
  if (document.getElementById('loader-generator')) initLoaderGenerator();
  if (document.getElementById('text-generator')) initTextGenerator();
  if (document.getElementById('card-generator')) initCardGenerator();
  if (document.getElementById('contact-form')) initContactForm();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE MENU DRAWER
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  if (toggleBtn && drawer && backdrop) {
    const toggleMenu = () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        backdrop.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        drawer.classList.add('open');
        backdrop.classList.add('active');
        toggleBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    toggleBtn.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);
  }

  // Active Nav Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Background toggle for preview stage (Light / Dark mode test)
  const bgToggles = document.querySelectorAll('.stage-bg-toggle');
  bgToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const stage = btn.closest('.preview-stage-wrapper').querySelector('.preview-stage');
      if (stage) {
        stage.classList.toggle('light-bg');
      }
    });
  });
}

/* ==========================================================================
   2. TOAST NOTIFICATIONS & CLIPBOARD HELPER
   ========================================================================== */
function initToast() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('CSS Code copied to clipboard!');
    if (btnElement) {
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = '✓ Copied!';
      btnElement.style.background = '#34d399';
      btnElement.style.color = '#000';
      setTimeout(() => {
        btnElement.innerHTML = originalText;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 2000);
    }
  }).catch(() => {
    showToast('Failed to copy. Please select manually.');
  });
}

/* ==========================================================================
   3. CSS ANIMATION GENERATOR ENGINE
   ========================================================================== */
function initAnimationGenerator() {
  const target = document.getElementById('anim-preview-box');
  const codeOutput = document.getElementById('anim-css-code');
  const copyBtn = document.getElementById('anim-copy-btn');
  const playBtn = document.getElementById('anim-play-btn');

  // Controls
  const typeSelect = document.getElementById('anim-type');
  const durationInput = document.getElementById('anim-duration');
  const durationVal = document.getElementById('anim-duration-val');
  const delayInput = document.getElementById('anim-delay');
  const delayVal = document.getElementById('anim-delay-val');
  const speedSelect = document.getElementById('anim-timing');
  const infiniteToggle = document.getElementById('anim-infinite');

  // Dynamic Keyframe Style Tag Injection
  let keyframeStyle = document.getElementById('dynamic-anim-keyframes');
  if (!keyframeStyle) {
    keyframeStyle = document.createElement('style');
    keyframeStyle.id = 'dynamic-anim-keyframes';
    document.head.appendChild(keyframeStyle);
  }

  const keyframesMap = {
    'fade-in': `@keyframes customFadeIn {\n  0% { opacity: 0; transform: scale(0.95); }\n  100% { opacity: 1; transform: scale(1); }\n}`,
    'fade-out': `@keyframes customFadeOut {\n  0% { opacity: 1; transform: scale(1); }\n  100% { opacity: 0; transform: scale(0.95); }\n}`,
    'bounce': `@keyframes customBounce {\n  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }\n  40% { transform: translateY(-30px); }\n  60% { transform: translateY(-15px); }\n}`,
    'shake': `@keyframes customShake {\n  0%, 100% { transform: translateX(0); }\n  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }\n  20%, 40%, 60%, 80% { transform: translateX(8px); }\n}`,
    'rotate': `@keyframes customRotate {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}`,
    'zoom': `@keyframes customZoom {\n  0% { transform: scale(0.3); opacity: 0; }\n  50% { opacity: 1; }\n  100% { transform: scale(1); opacity: 1; }\n}`,
    'slide': `@keyframes customSlide {\n  0% { transform: translateX(-100px); opacity: 0; }\n  100% { transform: translateX(0); opacity: 1; }\n}`,
    'pulse': `@keyframes customPulse {\n  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); }\n  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); }\n  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }\n}`,
    'flip': `@keyframes customFlip {\n  0% { transform: perspective(400deg) rotateY(0deg); }\n  100% { transform: perspective(400deg) rotateY(360deg); }\n}`
  };

  const animNameMap = {
    'fade-in': 'customFadeIn',
    'fade-out': 'customFadeOut',
    'bounce': 'customBounce',
    'shake': 'customShake',
    'rotate': 'customRotate',
    'zoom': 'customZoom',
    'slide': 'customSlide',
    'pulse': 'customPulse',
    'flip': 'customFlip'
  };

  function updateAnimation() {
    const type = typeSelect.value;
    const duration = durationInput.value;
    const delay = delayInput.value;
    const timing = speedSelect.value;
    const isInfinite = infiniteToggle.classList.contains('active');
    const iterCount = isInfinite ? 'infinite' : '1';

    durationVal.textContent = `${duration}s`;
    delayVal.textContent = `${delay}s`;

    const kf = keyframesMap[type];
    const animName = animNameMap[type];
    keyframeStyle.innerHTML = kf;

    // Reset element animation
    target.style.animation = 'none';
    void target.offsetWidth; // Trigger reflow

    target.style.animation = `${animName} ${duration}s ${timing} ${delay}s ${iterCount} both`;

    const generatedCSS = `${kf}\n\n.animated-element {\n  animation: ${animName} ${duration}s ${timing} ${delay}s ${iterCount} both;\n}`;
    codeOutput.textContent = generatedCSS;
  }

  // Event Listeners
  [typeSelect, speedSelect].forEach(el => el.addEventListener('change', updateAnimation));
  [durationInput, delayInput].forEach(el => el.addEventListener('input', updateAnimation));
  
  if (infiniteToggle) {
    infiniteToggle.addEventListener('click', () => {
      infiniteToggle.classList.toggle('active');
      updateAnimation();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', updateAnimation);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));
  }

  // Initial setup
  updateAnimation();
}

/* ==========================================================================
   4. BUTTON HOVER GENERATOR ENGINE
   ========================================================================== */
function initButtonGenerator() {
  const buttonTarget = document.getElementById('btn-preview-target');
  const codeOutput = document.getElementById('btn-css-code');
  const copyBtn = document.getElementById('btn-copy-btn');

  const effectSelect = document.getElementById('btn-effect');
  const bgInput = document.getElementById('btn-bg');
  const textInput = document.getElementById('btn-text');
  const hoverBgInput = document.getElementById('btn-hover-bg');
  const hoverTextInput = document.getElementById('btn-hover-text');
  const radiusInput = document.getElementById('btn-radius');
  const radiusVal = document.getElementById('btn-radius-val');
  const paddingInput = document.getElementById('btn-padding');
  const paddingVal = document.getElementById('btn-padding-val');

  let dynamicBtnStyle = document.getElementById('dynamic-btn-styles');
  if (!dynamicBtnStyle) {
    dynamicBtnStyle = document.createElement('style');
    dynamicBtnStyle.id = 'dynamic-btn-styles';
    document.head.appendChild(dynamicBtnStyle);
  }

  function updateButton() {
    const effect = effectSelect.value;
    const bg = bgInput.value;
    const text = textInput.value;
    const hoverBg = hoverBgInput.value;
    const hoverText = hoverTextInput.value;
    const radius = radiusInput.value;
    const padding = paddingInput.value;

    radiusVal.textContent = `${radius}px`;
    paddingVal.textContent = `${padding}px 1.5px`;

    let hoverEffectCSS = '';
    let extraRules = '';

    switch (effect) {
      case 'lift':
        hoverEffectCSS = `
.custom-btn {
  background-color: ${bg};
  color: ${text};
  border-radius: ${radius}px;
  padding: ${padding}px 1.8rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.custom-btn:hover {
  background-color: ${hoverBg};
  color: ${hoverText};
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.3);
}`;
        break;

      case 'glow':
        hoverEffectCSS = `
.custom-btn {
  background-color: ${bg};
  color: ${text};
  border-radius: ${radius}px;
  padding: ${padding}px 1.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 rgba(0,0,0,0);
}
.custom-btn:hover {
  background-color: ${hoverBg};
  color: ${hoverText};
  box-shadow: 0 0 25px ${hoverBg};
}`;
        break;

      case 'slide':
        hoverEffectCSS = `
.custom-btn {
  position: relative;
  background-color: ${bg};
  color: ${text};
  border-radius: ${radius}px;
  padding: ${padding}px 1.8rem;
  font-weight: 600;
  overflow: hidden;
  z-index: 1;
  transition: color 0.4s ease;
}
.custom-btn::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 0%; height: 100%;
  background-color: ${hoverBg};
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.custom-btn:hover {
  color: ${hoverText};
}
.custom-btn:hover::before {
  width: 100%;
}`;
        break;

      case 'border-trace':
        hoverEffectCSS = `
.custom-btn {
  background-color: ${bg};
  color: ${text};
  border-radius: ${radius}px;
  padding: ${padding}px 1.8rem;
  font-weight: 600;
  border: 2px solid ${bg};
  transition: all 0.3s ease;
}
.custom-btn:hover {
  background-color: transparent;
  color: ${hoverBg};
  border-color: ${hoverBg};
  box-shadow: 0 0 15px ${hoverBg};
}`;
        break;

      case 'pulse':
        hoverEffectCSS = `
.custom-btn {
  background-color: ${bg};
  color: ${text};
  border-radius: ${radius}px;
  padding: ${padding}px 1.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}
.custom-btn:hover {
  animation: btnPulse 1s infinite alternate;
  background-color: ${hoverBg};
  color: ${hoverText};
}
@keyframes btnPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}`;
        break;
    }

    dynamicBtnStyle.innerHTML = hoverEffectCSS;
    buttonTarget.className = 'custom-btn';

    codeOutput.textContent = hoverEffectCSS.trim();
  }

  [effectSelect, bgInput, textInput, hoverBgInput, hoverTextInput].forEach(el => el.addEventListener('change', updateButton));
  [radiusInput, paddingInput].forEach(el => el.addEventListener('input', updateButton));

  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));

  updateButton();
}

/* ==========================================================================
   5. GRADIENT GENERATOR ENGINE
   ========================================================================== */
function initGradientGenerator() {
  const preview = document.getElementById('grad-preview-target');
  const codeOutput = document.getElementById('grad-css-code');
  const copyBtn = document.getElementById('grad-copy-btn');

  const typeSelect = document.getElementById('grad-type');
  const color1Input = document.getElementById('grad-color1');
  const color2Input = document.getElementById('grad-color2');
  const color3Input = document.getElementById('grad-color3');
  const angleInput = document.getElementById('grad-angle');
  const angleVal = document.getElementById('grad-angle-val');
  const textGradToggle = document.getElementById('grad-text-toggle');

  function updateGradient() {
    const type = typeSelect.value;
    const c1 = color1Input.value;
    const c2 = color2Input.value;
    const c3 = color3Input.value;
    const angle = angleInput.value;
    const isTextGrad = textGradToggle && textGradToggle.classList.contains('active');

    angleVal.textContent = `${angle}°`;

    let gradValue = '';
    if (type === 'linear') {
      gradValue = `linear-gradient(${angle}deg, ${c1}, ${c2}, ${c3})`;
    } else if (type === 'radial') {
      gradValue = `radial-gradient(circle at center, ${c1}, ${c2}, ${c3})`;
    } else if (type === 'conic') {
      gradValue = `conic-gradient(from ${angle}deg at 50% 50%, ${c1}, ${c2}, ${c3}, ${c1})`;
    }

    if (isTextGrad) {
      preview.style.background = gradValue;
      preview.style.webkitBackgroundClip = 'text';
      preview.style.webkitTextFillColor = 'transparent';
      preview.style.fontSize = '2.5rem';
      preview.style.fontWeight = '900';
      preview.textContent = 'Gradient Text Preview';
    } else {
      preview.style.webkitBackgroundClip = 'unset';
      preview.style.webkitTextFillColor = 'unset';
      preview.style.background = gradValue;
      preview.style.fontSize = '1.1rem';
      preview.style.fontWeight = '700';
      preview.style.color = '#fff';
      preview.textContent = 'Gradient Card Preview';
    }

    let cssCode = `background: ${gradValue};`;
    if (isTextGrad) {
      cssCode = `background: ${gradValue};\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;`;
    }

    codeOutput.textContent = cssCode;
  }

  [typeSelect, color1Input, color2Input, color3Input].forEach(el => el.addEventListener('change', updateGradient));
  angleInput.addEventListener('input', updateGradient);

  if (textGradToggle) {
    textGradToggle.addEventListener('click', () => {
      textGradToggle.classList.toggle('active');
      updateGradient();
    });
  }

  // Presets chips click handler
  const chips = document.querySelectorAll('.preset-chip[data-grad]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const colors = chip.getAttribute('data-grad').split(',');
      if (colors.length >= 2) {
        color1Input.value = colors[0].trim();
        color2Input.value = colors[1].trim();
        color3Input.value = colors[2] ? colors[2].trim() : colors[1].trim();
        updateGradient();
      }
    });
  });

  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));

  updateGradient();
}

/* ==========================================================================
   6. BOX SHADOW GENERATOR ENGINE
   ========================================================================== */
function initShadowGenerator() {
  const preview = document.getElementById('shadow-preview-target');
  const codeOutput = document.getElementById('shadow-css-code');
  const copyBtn = document.getElementById('shadow-copy-btn');

  const xInput = document.getElementById('shadow-x');
  const xVal = document.getElementById('shadow-x-val');
  const yInput = document.getElementById('shadow-y');
  const yVal = document.getElementById('shadow-y-val');
  const blurInput = document.getElementById('shadow-blur');
  const blurVal = document.getElementById('shadow-blur-val');
  const spreadInput = document.getElementById('shadow-spread');
  const spreadVal = document.getElementById('shadow-spread-val');
  const colorInput = document.getElementById('shadow-color');
  const opacityInput = document.getElementById('shadow-opacity');
  const opacityVal = document.getElementById('shadow-opacity-val');
  const insetToggle = document.getElementById('shadow-inset');

  function hexToRgba(hex, alpha) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      c = '0x' + c.join('');
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
    }
    return hex;
  }

  function updateShadow() {
    const x = xInput.value;
    const y = yInput.value;
    const blur = blurInput.value;
    const spread = spreadInput.value;
    const hex = colorInput.value;
    const opacity = opacityInput.value;
    const isInset = insetToggle && insetToggle.classList.contains('active');

    xVal.textContent = `${x}px`;
    yVal.textContent = `${y}px`;
    blurVal.textContent = `${blur}px`;
    spreadVal.textContent = `${spread}px`;
    opacityVal.textContent = opacity;

    const rgba = hexToRgba(hex, opacity);
    const insetText = isInset ? 'inset ' : '';

    const shadowStr = `${insetText}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;

    preview.style.boxShadow = shadowStr;

    const cssCode = `box-shadow: ${shadowStr};\n-webkit-box-shadow: ${shadowStr};`;
    codeOutput.textContent = cssCode;
  }

  [xInput, yInput, blurInput, spreadInput, opacityInput].forEach(el => el.addEventListener('input', updateShadow));
  colorInput.addEventListener('change', updateShadow);

  if (insetToggle) {
    insetToggle.addEventListener('click', () => {
      insetToggle.classList.toggle('active');
      updateShadow();
    });
  }

  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));

  updateShadow();
}

/* ==========================================================================
   7. BORDER RADIUS GENERATOR ENGINE
   ========================================================================== */
function initRadiusGenerator() {
  const preview = document.getElementById('radius-preview-target');
  const codeOutput = document.getElementById('radius-css-code');
  const copyBtn = document.getElementById('radius-copy-btn');

  const tlInput = document.getElementById('radius-tl');
  const trInput = document.getElementById('radius-tr');
  const brInput = document.getElementById('radius-br');
  const blInput = document.getElementById('radius-bl');

  const tlVal = document.getElementById('radius-tl-val');
  const trVal = document.getElementById('radius-tr-val');
  const brVal = document.getElementById('radius-br-val');
  const blVal = document.getElementById('radius-bl-val');

  function updateRadius() {
    const tl = tlInput.value;
    const tr = trInput.value;
    const br = brInput.value;
    const bl = blInput.value;

    tlVal.textContent = `${tl}%`;
    trVal.textContent = `${tr}%`;
    brVal.textContent = `${br}%`;
    blVal.textContent = `${bl}%`;

    const radiusStr = `${tl}% ${tr}% ${br}% ${bl}%`;
    preview.style.borderRadius = radiusStr;

    codeOutput.textContent = `border-radius: ${radiusStr};`;
  }

  [tlInput, trInput, brInput, blInput].forEach(el => el.addEventListener('input', updateRadius));

  // Shape presets click handler
  const shapeChips = document.querySelectorAll('.preset-chip[data-shape]');
  shapeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const vals = chip.getAttribute('data-shape').split(',');
      if (vals.length === 4) {
        tlInput.value = vals[0];
        trInput.value = vals[1];
        brInput.value = vals[2];
        blInput.value = vals[3];
        updateRadius();
      }
    });
  });

  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));

  updateRadius();
}

/* ==========================================================================
   8. CSS LOADER GENERATOR ENGINE
   ========================================================================== */
function initLoaderGenerator() {
  const stage = document.getElementById('loader-preview-stage');
  const codeOutput = document.getElementById('loader-css-code');
  const copyBtn = document.getElementById('loader-copy-btn');

  const typeSelect = document.getElementById('loader-type');
  const colorInput = document.getElementById('loader-color');
  const sizeInput = document.getElementById('loader-size');
  const sizeVal = document.getElementById('loader-size-val');

  let dynamicLoaderStyle = document.getElementById('dynamic-loader-styles');
  if (!dynamicLoaderStyle) {
    dynamicLoaderStyle = document.createElement('style');
    dynamicLoaderStyle.id = 'dynamic-loader-styles';
    document.head.appendChild(dynamicLoaderStyle);
  }

  function updateLoader() {
    const type = typeSelect.value;
    const color = colorInput.value;
    const size = sizeInput.value;

    sizeVal.textContent = `${size}px`;

    let htmlMarkup = '';
    let cssRules = '';

    switch (type) {
      case 'spinner':
        htmlMarkup = `<div class="css-loader-spinner"></div>`;
        cssRules = `
.css-loader-spinner {
  width: ${size}px;
  height: ${size}px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: ${color};
  border-radius: 50%;
  animation: loaderSpin 1s linear infinite;
}
@keyframes loaderSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
        break;

      case 'dots':
        htmlMarkup = `<div class="css-loader-dots"><div></div><div></div><div></div></div>`;
        cssRules = `
.css-loader-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}
.css-loader-dots div {
  width: ${Math.round(size / 3)}px;
  height: ${Math.round(size / 3)}px;
  background-color: ${color};
  border-radius: 50%;
  animation: loaderBounce 0.6s infinite alternate;
}
.css-loader-dots div:nth-child(2) { animation-delay: 0.2s; }
.css-loader-dots div:nth-child(3) { animation-delay: 0.4s; }
@keyframes loaderBounce {
  to { opacity: 0.3; transform: translateY(-12px); }
}`;
        break;

      case 'pulse':
        htmlMarkup = `<div class="css-loader-pulse"></div>`;
        cssRules = `
.css-loader-pulse {
  width: ${size}px;
  height: ${size}px;
  background-color: ${color};
  border-radius: 50%;
  animation: loaderPulse 1.2s infinite ease-in-out;
}
@keyframes loaderPulse {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}`;
        break;

      case 'ring':
        htmlMarkup = `<div class="css-loader-ring"></div>`;
        cssRules = `
.css-loader-ring {
  width: ${size}px;
  height: ${size}px;
  border: 5px solid ${color};
  border-radius: 50%;
  animation: ringExpand 1.5s infinite ease-out;
}
@keyframes ringExpand {
  0% { transform: scale(0.2); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}`;
        break;
    }

    stage.innerHTML = htmlMarkup;
    dynamicLoaderStyle.innerHTML = cssRules;

    codeOutput.textContent = `/* HTML */\n${htmlMarkup}\n\n/* CSS */${cssRules}`;
  }

  typeSelect.addEventListener('change', updateLoader);
  colorInput.addEventListener('change', updateLoader);
  sizeInput.addEventListener('input', updateLoader);

  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));

  updateLoader();
}

/* ==========================================================================
   9. TEXT ANIMATION GENERATOR ENGINE
   ========================================================================== */
function initTextGenerator() {
  const target = document.getElementById('text-preview-target');
  const codeOutput = document.getElementById('text-css-code');
  const copyBtn = document.getElementById('text-copy-btn');

  const textInput = document.getElementById('text-content');
  const effectSelect = document.getElementById('text-effect');
  const colorInput = document.getElementById('text-color');
  const fontSizeInput = document.getElementById('text-size');
  const fontSizeVal = document.getElementById('text-size-val');

  let dynamicTextStyle = document.getElementById('dynamic-text-styles');
  if (!dynamicTextStyle) {
    dynamicTextStyle = document.createElement('style');
    dynamicTextStyle.id = 'dynamic-text-styles';
    document.head.appendChild(dynamicTextStyle);
  }

  function updateTextEffect() {
    const content = textInput.value || 'Frontend Toolkit';
    const effect = effectSelect.value;
    const color = colorInput.value;
    const size = fontSizeInput.value;

    fontSizeVal.textContent = `${size}px`;

    target.textContent = content;

    let cssRules = '';

    switch (effect) {
      case 'neon':
        cssRules = `
.animated-text {
  font-size: ${size}px;
  font-weight: 800;
  color: #fff;
  text-shadow: 
    0 0 7px ${color},
    0 0 10px ${color},
    0 0 21px ${color},
    0 0 42px ${color};
  animation: neonGlow 1.5s ease-in-out infinite alternate;
}
@keyframes neonGlow {
  from { text-shadow: 0 0 5px ${color}, 0 0 10px ${color}; }
  to { text-shadow: 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}; }
}`;
        break;

      case 'gradient-wave':
        cssRules = `
.animated-text {
  font-size: ${size}px;
  font-weight: 900;
  background: linear-gradient(90deg, ${color}, #818cf8, #34d399, ${color});
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradWave 3s linear infinite;
}
@keyframes gradWave {
  to { background-position: 200% center; }
}`;
        break;

      case 'typing':
        cssRules = `
.animated-text {
  font-size: ${size}px;
  font-weight: 700;
  color: ${color};
  font-family: monospace;
  overflow: hidden;
  border-right: 3px solid ${color};
  white-space: nowrap;
  letter-spacing: 0.1em;
  animation: typing 3.5s steps(30, end) infinite, blink 0.75s step-end infinite;
}
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink {
  from, to { border-color: transparent }
  50% { border-color: ${color}; }
}`;
        break;
    }

    dynamicTextStyle.innerHTML = cssRules;
    target.className = 'animated-text';

    codeOutput.textContent = cssRules.trim();
  }

  textInput.addEventListener('input', updateTextEffect);
  effectSelect.addEventListener('change', updateTextEffect);
  colorInput.addEventListener('change', updateTextEffect);
  fontSizeInput.addEventListener('input', updateTextEffect);

  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));

  updateTextEffect();
}

/* ==========================================================================
   10. CARD HOVER GENERATOR ENGINE
   ========================================================================== */
function initCardGenerator() {
  const cardTarget = document.getElementById('card-preview-target');
  const codeOutput = document.getElementById('card-css-code');
  const copyBtn = document.getElementById('card-copy-btn');

  const effectSelect = document.getElementById('card-effect');
  const bgInput = document.getElementById('card-bg');
  const accentInput = document.getElementById('card-accent');
  const radiusInput = document.getElementById('card-radius');

  let dynamicCardStyle = document.getElementById('dynamic-card-styles');
  if (!dynamicCardStyle) {
    dynamicCardStyle = document.createElement('style');
    dynamicCardStyle.id = 'dynamic-card-styles';
    document.head.appendChild(dynamicCardStyle);
  }

  function updateCard() {
    const effect = effectSelect.value;
    const bg = bgInput.value;
    const accent = accentInput.value;
    const radius = radiusInput.value;

    let cssRules = '';

    switch (effect) {
      case 'lift-shadow':
        cssRules = `
.hover-card {
  background: ${bg};
  border-radius: ${radius}px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.hover-card:hover {
  transform: translateY(-8px);
  border-color: ${accent};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${accent}40;
}`;
        break;

      case 'border-glow':
        cssRules = `
.hover-card {
  position: relative;
  background: ${bg};
  border-radius: ${radius}px;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}
.hover-card:hover {
  border-color: ${accent};
  box-shadow: inset 0 0 15px ${accent}30, 0 0 20px ${accent}50;
}`;
        break;
    }

    dynamicCardStyle.innerHTML = cssRules;
    cardTarget.className = 'hover-card';

    codeOutput.textContent = cssRules.trim();
  }

  effectSelect.addEventListener('change', updateCard);
  bgInput.addEventListener('change', updateCard);
  accentInput.addEventListener('change', updateCard);
  radiusInput.addEventListener('input', updateCard);

  if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(codeOutput.textContent, copyBtn));

  updateCard();
}

/* ==========================================================================
   11. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const messagesList = document.getElementById('messages-list');
  const clearBtn = document.getElementById('clear-messages-btn');

  function getDeviceAuthorId() {
    let authorId = localStorage.getItem('cssmotionlab_author_id');
    if (!authorId) {
      authorId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      localStorage.setItem('cssmotionlab_author_id', authorId);
    }
    return authorId;
  }

  function getSavedMessages() {
    try {
      return JSON.parse(localStorage.getItem('cssmotionlab_messages')) || [];
    } catch (e) {
      return [];
    }
  }

  function renderMessages() {
    if (!messagesList) return;
    const messages = getSavedMessages();
    const currentAuthorId = getDeviceAuthorId();

    if (messages.length === 0) {
      messagesList.innerHTML = `
        <div style="padding: 1.25rem; text-align: center; background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 0.9rem;">
          📭 No messages received yet. Submit the form above to test sending a message!
        </div>
      `;
      return;
    }

    messagesList.innerHTML = messages.map((msg) => {
      const isMyMessage = Boolean(msg.authorId && msg.authorId === currentAuthorId);

      return `
        <div style="padding: 1rem; background: ${isMyMessage ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.03)'}; border: 1px solid ${isMyMessage ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-color)'}; border-radius: 8px; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${escapeHtml(msg.name)}</strong>
              <span style="color: var(--primary); font-size: 0.825rem; margin-left: 0.5rem;">&lt;${escapeHtml(msg.email)}&gt;</span>
              ${isMyMessage ? '<span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); font-size: 0.725rem; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600; margin-left: 0.5rem;">Your Message</span>' : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 0.775rem; color: var(--text-muted);">${escapeHtml(msg.date)}</span>
              ${isMyMessage ? `
                <button type="button" class="delete-single-msg-btn" data-id="${msg.id}" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; padding: 0.2rem 0.55rem; font-size: 0.75rem; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 0.25rem;">
                  🗑️ Delete My Message
                </button>
              ` : `
                <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; opacity: 0.75;" title="You cannot delete another user's message">
                  🔒 Sent by another user
                </span>
              `}
            </div>
          </div>
          <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa; margin-bottom: 0.35rem; font-weight: 600;">
            Subject: ${escapeHtml(msg.subject)}
          </div>
          <p style="color: var(--text-muted); line-height: 1.5; white-space: pre-wrap; margin: 0; background: rgba(0,0,0,0.2); padding: 0.65rem; border-radius: 6px;">${escapeHtml(msg.message)}</p>
        </div>
      `;
    }).join('');

    // Attach click listeners ONLY to delete buttons of user's own messages
    const deleteBtns = messagesList.querySelectorAll('.delete-single-msg-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const msgId = e.currentTarget.getAttribute('data-id');
        deleteSingleMessage(msgId);
      });
    });
  }

  function deleteSingleMessage(msgId) {
    const messages = getSavedMessages();
    const currentAuthorId = getDeviceAuthorId();
    const targetIndex = messages.findIndex(m => m.id === msgId);

    if (targetIndex === -1) {
      showToast('Message not found.');
      return;
    }

    if (messages[targetIndex].authorId !== currentAuthorId) {
      showToast('🔒 Access Denied: You can only delete your own messages!');
      return;
    }

    messages.splice(targetIndex, 1);
    localStorage.setItem('cssmotionlab_messages', JSON.stringify(messages));
    renderMessages();
    showToast('🗑️ Your message was deleted successfully!');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const messages = getSavedMessages();
      const currentAuthorId = getDeviceAuthorId();
      const myMessages = messages.filter(m => m.authorId === currentAuthorId);

      if (myMessages.length === 0) {
        showToast('You have no sent messages to clear.');
        return;
      }

      if (confirm(`Are you sure you want to delete all ${myMessages.length} of your sent messages?`)) {
        const remainingMessages = messages.filter(m => m.authorId !== currentAuthorId);
        localStorage.setItem('cssmotionlab_messages', JSON.stringify(remainingMessages));
        renderMessages();
        showToast('🗑️ All your sent messages have been cleared!');
      }
    });
  }

  renderMessages();

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subjectSelect = document.getElementById('contact-subject');
      const subject = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : 'General Inquiry';
      const message = document.getElementById('contact-message').value.trim();
      const currentAuthorId = getDeviceAuthorId();

      const newMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
        authorId: currentAuthorId,
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleString()
      };

      const originalText = submitBtn ? submitBtn.innerHTML : '📨 Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Sending Message...';
      }

      setTimeout(() => {
        // Save to LocalStorage
        const existingMessages = getSavedMessages();
        existingMessages.unshift(newMessage);
        localStorage.setItem('cssmotionlab_messages', JSON.stringify(existingMessages));

        renderMessages();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        let alertBox = form.querySelector('.form-alert');
        if (!alertBox) {
          alertBox = document.createElement('div');
          alertBox.className = 'form-alert';
          alertBox.style.cssText = 'padding: 0.85rem 1rem; margin-top: 1rem; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; border-radius: 8px; font-weight: 500; text-align: center; font-size: 0.95rem; animation: fadeIn 0.3s ease;';
          form.appendChild(alertBox);
        }
        
        alertBox.innerHTML = '✅ <strong>Message Sent &amp; Published!</strong> You can manage your sent messages below.';
        
        showToast('Thank you! Your message was sent.');
        form.reset();

        setTimeout(() => {
          if (alertBox) alertBox.remove();
        }, 6000);
      }, 500);
    });
  }
}
