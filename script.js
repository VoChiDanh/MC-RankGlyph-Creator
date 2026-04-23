const tileSize = 8;
const padding = 1;
const spacing = 1;

const fontImage = new Image();
let charWidths = {};
let fontLoaded = false;

const presetCategories = {
  "👑 Leadership & Admin": {
    RankOwner: {
      text: "OWNER",
      textCol: "#ffffff",
      bg: "#aa0000",
      border: "#550000",
    },
    RankCoOwner: {
      text: "CO-OWNER",
      textCol: "#ffffff",
      bg: "#ff5555",
      border: "#aa0000",
    },
    RankFounder: {
      text: "FOUNDER",
      textCol: "#ffffff",
      bg: "#ffaa00",
      border: "#aa5500",
    },
    RankManager: {
      text: "MANAGER",
      textCol: "#ffffff",
      bg: "#aa00aa",
      border: "#550055",
    },
    RankSrAdmin: {
      text: "SR.ADMIN",
      textCol: "#ffffff",
      bg: "#0000aa",
      border: "#000055",
    },
    RankAdmin: {
      text: "ADMIN",
      textCol: "#ffffff",
      bg: "#5555ff",
      border: "#0000aa",
    },
  },
  "🛡️ Staff & Moderation": {
    RankSrMod: {
      text: "SR.MOD",
      textCol: "#ffffff",
      bg: "#005500",
      border: "#003300",
    },
    RankMod: {
      text: "MOD",
      textCol: "#ffffff",
      bg: "#55ff55",
      border: "#00aa00",
    },
    RankTrialMod: {
      text: "TRIAL-MOD",
      textCol: "#ffffff",
      bg: "#aaff55",
      border: "#55aa00",
    },
    RankHelper: {
      text: "HELPER",
      textCol: "#ffffff",
      bg: "#ffff55",
      border: "#aaaa00",
    },
    RankStaff: {
      text: "STAFF",
      textCol: "#ffffff",
      bg: "#55ffff",
      border: "#00aaaa",
    },
  },
  "🛠️ Development & Build": {
    RankDev: {
      text: "DEV",
      textCol: "#ffffff",
      bg: "#ffaa00",
      border: "#aa5500",
    },
    RankBuilder: {
      text: "BUILDER",
      textCol: "#ffffff",
      bg: "#55ff55",
      border: "#00aa00",
    },
    RankArchitect: {
      text: "ARCHITECT",
      textCol: "#ffffff",
      bg: "#55ffff",
      border: "#00aaaa",
    },
  },
  "🎨 Creators & Media": {
    RankYouTube: {
      text: "YOUTUBE",
      textCol: "#ffffff",
      bg: "#ff5555",
      border: "#ffffff",
    },
    RankTwitch: {
      text: "TWITCH",
      textCol: "#ffffff",
      bg: "#aa00aa",
      border: "#ffffff",
    },
    RankTikTok: {
      text: "TIKTOK",
      textCol: "#ffffff",
      bg: "#111111",
      border: "#55ffff",
    },
    RankMedia: {
      text: "MEDIA",
      textCol: "#ffffff",
      bg: "#ff55ff",
      border: "#aa00aa",
    },
    RankCreator: {
      text: "CREATOR",
      textCol: "#ffffff",
      bg: "#ff88aa",
      border: "#aa3355",
    },
  },
  "💎 Premium Donators": {
    RankMVPPlusPlus: {
      text: "MVP++",
      textCol: "#ffaa00",
      bg: "#55ffff",
      border: "#00aaaa",
    },
    RankMVPPlus: {
      text: "MVP+",
      textCol: "#ff5555",
      bg: "#55ffff",
      border: "#00aaaa",
    },
    RankMVP: {
      text: "MVP",
      textCol: "#ffffff",
      bg: "#55ffff",
      border: "#00aaaa",
    },
    RankVIPPlus: {
      text: "VIP+",
      textCol: "#ffaa00",
      bg: "#55ff55",
      border: "#00aa00",
    },
    RankVIP: {
      text: "VIP",
      textCol: "#ffffff",
      bg: "#55ff55",
      border: "#00aa00",
    },
    RankTitan: {
      text: "TITAN",
      textCol: "#ffffff",
      bg: "#ff5555",
      border: "#aa0000",
    },
  },
  "👥 Players & Special": {
    RankNitro: {
      text: "NITRO",
      textCol: "#ffffff",
      bg: "#ff88dd",
      border: "#aa00aa",
    },
    RankVeteran: {
      text: "VETERAN",
      textCol: "#ffffff",
      bg: "#005500",
      border: "#003300",
    },
    RankMember: {
      text: "MEMBER",
      textCol: "#ffffff",
      bg: "#aaaaaa",
      border: "#555555",
    },
  },
};

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToHex(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustHSL(colorHex, lightnessAdjustment) {
  const hsl = hexToHSL(colorHex);
  const newL = Math.min(Math.max(hsl.l + lightnessAdjustment, 0), 1);
  return hslToHex(hsl.h, hsl.s, newL);
}

const presets = {};
for (const cat in presetCategories) {
  for (const key in presetCategories[cat]) {
    const p = presetCategories[cat][key];
    p.shadow = adjustHSL(p.bg, -0.15);
    presets[key] = p;
  }
}

function renderVisualPresets() {
  const container = document.getElementById("presetContainer");
  container.innerHTML = "";
  for (const categoryName in presetCategories) {
    const title = document.createElement("div");
    title.className = "preset-group-title";
    title.innerText = categoryName;
    container.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "preset-grid";

    for (const key in presetCategories[categoryName]) {
      const presetData = presetCategories[categoryName][key];
      const btn = document.createElement("button");
      btn.className = "preset-chip";
      btn.innerText = presetData.text;
      btn.style.backgroundColor = presetData.bg;
      btn.style.borderColor = presetData.border;
      btn.style.color = presetData.textCol || "#ffffff";

      btn.onclick = () => applyPreset(key);
      grid.appendChild(btn);
    }
    container.appendChild(grid);
  }
}

const elements = {
  textInput: document.getElementById("textInput"),
  canvas: document.getElementById("canvas"),
  previewImg: document.getElementById("previewImg"),
  textColorPicker: document.getElementById("textColorPicker"),
  textColorHex: document.getElementById("textColorHex"),
  bgColorPicker: document.getElementById("bgColorPicker"),
  bgColorHex: document.getElementById("bgColorHex"),
  borderColorPicker: document.getElementById("borderColorPicker"),
  borderColorHex: document.getElementById("borderColorHex"),
  shadowColorPicker: document.getElementById("shadowColorPicker"),
  shadowColorHex: document.getElementById("shadowColorHex"),
  shadowOffsetX: document.getElementById("shadowOffsetX"),
  shadowOffsetY: document.getElementById("shadowOffsetY"),
  showBorder: document.getElementById("showBorder"),
  showShadow: document.getElementById("showShadow"),
  exportScale: document.getElementById("exportScale"),
  downloadBtn: document.getElementById("downloadBtn"),
  copyBtn: document.getElementById("copyBtn"),
  resetBtn: document.getElementById("resetBtn"),
  zoomInBtn: document.getElementById("zoomInBtn"),
  zoomOutBtn: document.getElementById("zoomOutBtn"),
  zoomDisplay: document.getElementById("zoomDisplay"),
  autoSyncToggle: document.getElementById("autoSyncToggle"),
};

const state = {
  text: "MVP+",
  textColor: "#ffffff",
  bgColor: "#ffaa00",
  borderColor: "#ff5555",
  shadowColor: "#aa5500",
  shadowOffsetX: 1,
  shadowOffsetY: 1,
  showBorder: true,
  showShadow: true,
  zoomLevel: 3.5,
};

function updateZoomView() {
  elements.previewImg.style.transform = `scale(${state.zoomLevel})`;
  elements.zoomDisplay.innerText = `${Math.round(state.zoomLevel * 100)}%`;
}

function performMagicSync(seedColor) {
  const hexToRgb = (h) => {
    let r = parseInt(h.slice(1, 3), 16),
        g = parseInt(h.slice(3, 5), 16),
        b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };

  const getLum = ({ r, g, b }) => {
    let [rs, gs, bs] = [r, g, b].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
  };

  const getContrast = (l1, l2) => {
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const seedRgb = hexToRgb(seedColor);
  const seedLum = getLum(seedRgb);
  const hsl = hexToHSL(seedColor);

  let bgHue = (hsl.h + 0.58) % 1.0; 

  let bgS = Math.min(0.40, hsl.s * 0.6); 

  let isTextLight = seedLum > 0.179; 
  let bgL, borderL, shadowL;

  if (isTextLight) {
    bgL = 0.25; 
    while (bgL > 0 && getContrast(seedLum, getLum(hexToRgb(hslToHex(bgHue, bgS, bgL)))) < 4.5) {
      bgL -= 0.02; 
    }
    
    borderL = Math.max(0.15, hsl.l * 0.35);
    
    shadowL = Math.max(0.02, bgL - 0.15);
  } else {
    bgL = 0.75; 
    while (bgL < 1 && getContrast(seedLum, getLum(hexToRgb(hslToHex(bgHue, bgS, bgL)))) < 4.5) {
      bgL += 0.02;
    }
    
    borderL = Math.min(0.85, hsl.l * 1.8);
    
    shadowL = Math.max(0.10, bgL - 0.25);
  }

  elements.bgColorPicker.value = hslToHex(bgHue, bgS, bgL);
  elements.borderColorPicker.value = hslToHex(hsl.h, Math.min(0.8, hsl.s), borderL); 
  elements.shadowColorPicker.value = hslToHex(bgHue, bgS, shadowL);

  updateStateFromInputs(true);
}

function charToIndex(char) {
  const code = char.charCodeAt(0);
  return code >= 32 && code <= 127 ? code - 32 : 0;
}

function analyzeCharWidths() {
  if (!fontImage.complete || fontImage.naturalWidth === 0) return;
  const offCanvas = document.createElement("canvas");
  offCanvas.width = 128;
  offCanvas.height = 128;
  const ctx = offCanvas.getContext("2d");
  ctx.drawImage(fontImage, 0, 0);

  for (let i = 0; i < 96; i++) {
    const sx = (i % 16) * tileSize,
      sy = Math.floor(i / 16) * tileSize;
    let minX = tileSize,
      maxX = 0,
      hasPixel = false;

    if (sx + tileSize <= offCanvas.width && sy + tileSize <= offCanvas.height) {
      try {
        const data = ctx.getImageData(sx, sy, tileSize, tileSize).data;
        for (let y = 0; y < tileSize; y++) {
          for (let x = 0; x < tileSize; x++) {
            if (data[(y * tileSize + x) * 4 + 3] > 0) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              hasPixel = true;
            }
          }
        }
      } catch (e) {
        hasPixel = false;
      }
    }

    if (i === 11 || i === 13) { 
      charWidths[i] = { width: 5, offsetX: 0, isCustom: true };
    } else if (i === 14) { 
      charWidths[i] = { width: 3, offsetX: 0, isCustom: true }; 
    } else if (!hasPixel) {
      if (i === 0)
        charWidths[i] = {
          width: Math.floor(tileSize / 2),
          offsetX: 0,
          isCustom: false,
        };
      else charWidths[i] = { width: 0, offsetX: 0, isCustom: false };
    } else {
      charWidths[i] = {
        width: maxX - minX + 1,
        offsetX: minX,
        isCustom: false,
      };
    }
  }
}

function colorize(image, colorHex) {
  const r = parseInt(colorHex.slice(1, 3), 16) / 255;
  const g = parseInt(colorHex.slice(3, 5), 16) / 255;
  const b = parseInt(colorHex.slice(5, 7), 16) / 255;
  const offscreen = document.createElement("canvas");
  offscreen.width = image.width;
  offscreen.height = image.height;
  const ctx = offscreen.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] *= r;
    data[i + 1] *= g;
    data[i + 2] *= b;
  }
  ctx.putImageData(imageData, 0, 0);
  return offscreen;
}

function draw() {
  if (!fontLoaded) return;
  const ctx = elements.canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const chars = state.text.toLowerCase().split("");
  let currentTotalWidth = padding + 1;
  for (const char of chars) {
    const charInfo = charWidths[charToIndex(char)] || {
      width: tileSize,
      offsetX: 0,
      isCustom: false,
    };
    currentTotalWidth += charInfo.width + spacing;
  }

  const finalWidth = currentTotalWidth - spacing + (padding + 1);
  const canvasHeight = tileSize + 1;

  elements.canvas.width = finalWidth;
  elements.canvas.height = canvasHeight;

  ctx.fillStyle = state.bgColor;
  ctx.fillRect(0, 0, finalWidth, canvasHeight);

  if (state.showBorder) {
    ctx.strokeStyle = state.borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, finalWidth, canvasHeight);
  }

  let currentFontImage = fontImage;
  if (state.textColor.toUpperCase() !== "#FFFFFF") {
    currentFontImage = colorize(fontImage, state.textColor);
  }

  let cursorX = padding + 1;
  for (const char of chars) {
    const i = charToIndex(char);
    const charInfo = charWidths[i] || {
      width: tileSize,
      offsetX: 0,
      isCustom: false,
    };
    const drawY = 0;

    if (charInfo.isCustom) {
      const isPlus = char === "+";
      const isMinus = char === "-";
      const isDot = char === ".";

      if (isPlus) {
        if (state.showShadow) {
          ctx.fillStyle = state.shadowColor;
          ctx.fillRect(
            cursorX + 2 + state.shadowOffsetX,
            drawY + 2 + state.shadowOffsetY,
            1,
            3,
          );
          ctx.fillRect(
            cursorX + 1 + state.shadowOffsetX,
            drawY + 3 + state.shadowOffsetY,
            3,
            1,
          );
        }
        ctx.fillStyle = state.textColor;
        ctx.fillRect(cursorX + 2, drawY + 2, 1, 3);
        ctx.fillRect(cursorX + 1, drawY + 3, 3, 1);
      } else if (isMinus) {
        if (state.showShadow) {
          ctx.fillStyle = state.shadowColor;
          ctx.fillRect(
            cursorX + 1 + state.shadowOffsetX,
            drawY + 3 + state.shadowOffsetY,
            3,
            1,
          );
        }
        ctx.fillStyle = state.textColor;
        ctx.fillRect(cursorX + 1, drawY + 3, 3, 1);
      } else if (isDot) {
        if (state.showShadow) {
          ctx.fillStyle = state.shadowColor;
          ctx.fillRect(
            cursorX + 1 + state.shadowOffsetX,
            drawY + 5 + state.shadowOffsetY,
            2,
            2,
          );
        }
        ctx.fillStyle = state.textColor;
        ctx.fillRect(cursorX + 1, drawY + 5, 2, 2);
      }
    } else if (charInfo.width > 0) {
      const tx = (i % 16) * tileSize + charInfo.offsetX;
      const ty = Math.floor(i / 16) * tileSize;

      if (state.showShadow) {
        const shadowCanvas = colorize(fontImage, state.shadowColor);
        if (shadowCanvas) {
          ctx.drawImage(
            shadowCanvas,
            tx,
            ty,
            charInfo.width,
            tileSize,
            cursorX + state.shadowOffsetX,
            drawY + state.shadowOffsetY,
            charInfo.width,
            tileSize,
          );
        }
      }
      ctx.drawImage(
        currentFontImage,
        tx,
        ty,
        charInfo.width,
        tileSize,
        cursorX,
        drawY,
        charInfo.width,
        tileSize,
      );
    }

    cursorX += charInfo.width + spacing;
  }

  elements.previewImg.src = elements.canvas.toDataURL("image/png");
  elements.previewImg.style.backgroundColor = state.bgColor;
  elements.previewImg.style.borderColor = state.showBorder
    ? state.borderColor
    : "transparent";
}

function updateStateFromInputs(skipAutoSync = false) {
  state.text = elements.textInput.value || " ";
  state.textColor = elements.textColorPicker.value;
  state.bgColor = elements.bgColorPicker.value;
  state.borderColor = elements.borderColorPicker.value;
  state.shadowColor = elements.shadowColorPicker.value;
  state.showBorder = elements.showBorder.checked;
  state.showShadow = elements.showShadow.checked;
  state.shadowOffsetX = parseInt(elements.shadowOffsetX.value) || 0;
  state.shadowOffsetY = parseInt(elements.shadowOffsetY.value) || 0;

  elements.textColorHex.value = state.textColor;
  elements.bgColorHex.value = state.bgColor;
  elements.borderColorHex.value = state.borderColor;
  elements.shadowColorHex.value = state.shadowColor;

  if (elements.autoSyncToggle.checked && !skipAutoSync) {
    performMagicSync(state.textColor);
    return;
  }

  draw();
}

function applyPreset(name) {
  const preset = presets[name];
  if (preset) {
    elements.bgColorPicker.value = preset.bg;
    elements.borderColorPicker.value = preset.border;
    elements.shadowColorPicker.value = preset.shadow;
    elements.textColorPicker.value = preset.textCol || "#ffffff";
    elements.textInput.value = preset.text;

    elements.autoSyncToggle.checked = false;

    updateStateFromInputs(true);
    showToast(`Applied preset style: ${preset.text}`, "success");

    elements.previewImg.style.transform = "scale(3.2)";
    setTimeout(() => {
      elements.previewImg.style.transform = `scale(${state.zoomLevel})`;
    }, 150);
  }
}

function getScaledCanvasDataUrl() {
  const scale = parseInt(elements.exportScale.value) || 1;
  if (scale === 1) return elements.canvas.toDataURL("image/png");

  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = elements.canvas.width * scale;
  scaledCanvas.height = elements.canvas.height * scale;
  const ctx = scaledCanvas.getContext("2d");

  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale, scale);
  ctx.drawImage(elements.canvas, 0, 0);

  return scaledCanvas.toDataURL("image/png");
}

function downloadImage() {
  if (!elements.canvas.width) return;
  const link = document.createElement("a");
  link.href = getScaledCanvasDataUrl();
  link.download = `${state.text.replace(/[^a-z0-9_+\-*]/gi, "_") || "rank"}_x${elements.exportScale.value}.png`;
  link.click();
  showToast("HD Image downloaded successfully!", "success");
}

async function copyToClipboard() {
  if (!elements.canvas.width) return;
  try {
    const dataUrl = getScaledCanvasDataUrl();
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    showToast("Copied to Clipboard! (Press Ctrl+V to paste)", "success");
  } catch (err) {
    showToast("Browser does not support clipboard copying.", "error");
  }
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const svgIcon =
    type === "success"
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : type === "error"
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

  toast.innerHTML = `${svgIcon} <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function resetToDefault() {
  elements.textInput.value = "MVP+";
  elements.textColorPicker.value = "#ffffff";
  elements.bgColorPicker.value = "#ffaa00";
  elements.borderColorPicker.value = "#ff5555";
  elements.shadowColorPicker.value = "#aa5500";
  elements.shadowOffsetX.value = 1;
  elements.shadowOffsetY.value = 1;
  elements.showBorder.checked = true;
  elements.showShadow.checked = true;
  elements.exportScale.value = "8";
  elements.autoSyncToggle.checked = false;
  state.zoomLevel = 3.5;
  updateZoomView();
  updateStateFromInputs(true);
  showToast("Restored to default settings.", "info");
}

["textInput", "shadowOffsetX", "shadowOffsetY"].forEach((id) =>
  elements[id].addEventListener("input", () => updateStateFromInputs()),
);

elements.textColorPicker.addEventListener("input", () =>
  updateStateFromInputs(),
);
elements.textColorHex.addEventListener("input", (e) => {
  let hex = e.target.value.trim();
  if (!hex.startsWith("#")) hex = "#" + hex;
  if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
    elements.textColorPicker.value = hex;
    updateStateFromInputs();
  }
});

["bgColorPicker", "borderColorPicker", "shadowColorPicker"].forEach((id) => {
  elements[id].addEventListener("input", () => {
    elements.autoSyncToggle.checked = false;
    updateStateFromInputs(true);
  });
});

["bg", "border", "shadow"].forEach((prefix) => {
  elements[`${prefix}ColorHex`].addEventListener("input", (e) => {
    let hex = e.target.value.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) {
      elements[`${prefix}ColorPicker`].value = hex;
      elements.autoSyncToggle.checked = false;
      updateStateFromInputs(true);
    }
  });
});

["showBorder", "showShadow"].forEach((id) =>
  elements[id].addEventListener("change", () => updateStateFromInputs(true)),
);

elements.autoSyncToggle.addEventListener("change", () => {
  if (elements.autoSyncToggle.checked)
    performMagicSync(elements.textColorPicker.value);
});

elements.zoomInBtn.addEventListener("click", () => {
  state.zoomLevel = Math.min(10, state.zoomLevel + 0.5);
  updateZoomView();
});
elements.zoomOutBtn.addEventListener("click", () => {
  state.zoomLevel = Math.max(1, state.zoomLevel - 0.5);
  updateZoomView();
});
elements.downloadBtn.addEventListener("click", downloadImage);
elements.copyBtn.addEventListener("click", copyToClipboard);
elements.resetBtn.addEventListener("click", resetToDefault);

renderVisualPresets();
updateZoomView();
fontImage.onload = () => {
  fontLoaded = true;
  analyzeCharWidths();
  draw();
};

fontImage.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIFJREFUeF7tyqERwzAMQFHDwI6gUTyCxygUNBT80DAjeJSOEOgRBAWbS+46QHtlevDfLz9KSV09emcFBloKgFWjbsOOF2dwY6096rZszjPEdUBlGPt1qEdVlhKg5Quu3gOAuANgArT2+AQVmCJyBx++Ce1oUu9gT1xUQKL8UUoppTfbFkXRdMiOkQAAAABJRU5ErkJggg==";
