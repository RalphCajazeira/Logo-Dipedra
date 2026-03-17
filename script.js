const defaults = {
  mainText: "DIPEDRA",
  secondaryText: "Rochas Ornamentais",
  mainFont: "stopregular",
  secondaryFont: "BeckerGothics-Stencil",
  mainCustomFontName: "",
  secondaryCustomFontName: "",
  mainColor: "#ffffff",
  secondaryColor: "#ffffff",
  bgColor: "#000000",
  transparentBg: false,
  mainSize: 250,
  secondarySize: 45,
  padY: 1,
  padX: 1,
  lockPadding: false,
  borderRadius: 0,
  resolutionPreset: "1920x1080",
  exportWidth: 1920,
  exportHeight: 1080,
  lockAspectRatio: true,
  downloadFormat: "png",
}

const els = {
  mainText: document.getElementById("mainText"),
  secondaryText: document.getElementById("secondaryText"),
  mainFont: document.getElementById("mainFont"),
  secondaryFont: document.getElementById("secondaryFont"),
  mainCustomFontName: document.getElementById("mainCustomFontName"),
  secondaryCustomFontName: document.getElementById("secondaryCustomFontName"),
  mainFontFile: document.getElementById("mainFontFile"),
  secondaryFontFile: document.getElementById("secondaryFontFile"),
  mainColor: document.getElementById("mainColor"),
  secondaryColor: document.getElementById("secondaryColor"),
  bgColor: document.getElementById("bgColor"),
  transparentBg: document.getElementById("transparentBg"),
  mainSize: document.getElementById("mainSize"),
  secondarySize: document.getElementById("secondarySize"),
  padY: document.getElementById("padY"),
  padX: document.getElementById("padX"),
  lockPadding: document.getElementById("lockPadding"),
  borderRadius: document.getElementById("borderRadius"),
  resolutionPreset: document.getElementById("resolutionPreset"),
  exportWidth: document.getElementById("exportWidth"),
  exportHeight: document.getElementById("exportHeight"),
  lockAspectRatio: document.getElementById("lockAspectRatio"),
  logoViewport: document.getElementById("logoViewport"),
  logoScaler: document.getElementById("logoScaler"),
  logoStage: document.getElementById("logoStage"),
  logoCard: document.getElementById("logoCard"),
  logoMain: document.getElementById("logoMain"),
  logoSecondary: document.getElementById("logoSecondary"),
  downloadBtn: document.getElementById("downloadBtn"),
  resetBtn: document.getElementById("resetBtn"),
}

const fontState = {
  mainUpload: null,
  secondaryUpload: null,
  mainPreset: null,
  secondaryPreset: null,
  aspectRatio: defaults.exportWidth / defaults.exportHeight,
}

function fontFormatFromName(fileName = "") {
  const ext = fileName.split(".").pop()?.toLowerCase()
  if (ext === "ttf") return "truetype"
  if (ext === "otf") return "opentype"
  if (ext === "woff") return "woff"
  if (ext === "woff2") return "woff2"
  return "truetype"
}

async function fileToDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function pathToDataUrl(path) {
  const response = await fetch(path)
  const blob = await response.blob()
  return await fileToDataUrl(blob)
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function toCssFontFamily(value) {
  if (!value) return "Arial, sans-serif"
  return value.includes(",") || value.includes('"') || value.includes("'")
    ? value
    : `'${value}'`
}

function getMainFontChoice() {
  if (fontState.mainUpload?.family) return fontState.mainUpload.family
  if (els.mainCustomFontName.value.trim())
    return els.mainCustomFontName.value.trim()
  return els.mainFont.value
}

function getSecondaryFontChoice() {
  if (fontState.secondaryUpload?.family) return fontState.secondaryUpload.family
  if (els.secondaryCustomFontName.value.trim())
    return els.secondaryCustomFontName.value.trim()
  return els.secondaryFont.value
}

function fitPreview() {
  const viewport = els.logoViewport
  const scaler = els.logoScaler
  const art = els.logoCard

  if (!viewport || !scaler || !art) return

  scaler.style.transform = "scale(1)"

  const viewportWidth = viewport.clientWidth
  const viewportHeight = viewport.clientHeight

  const artWidth = art.scrollWidth
  const artHeight = art.scrollHeight

  if (!viewportWidth || !viewportHeight || !artWidth || !artHeight) return

  const safetyX = 48
  const safetyY = 48

  const usableWidth = Math.max(0, viewportWidth - safetyX)
  const usableHeight = Math.max(0, viewportHeight - safetyY)

  const scaleX = usableWidth / artWidth
  const scaleY = usableHeight / artHeight
  const scale = Math.min(scaleX, scaleY, 1)

  scaler.style.transform = `scale(${scale})`
  scaler.style.transformOrigin = "center center"
}

function setDefaults() {
  els.mainText.value = defaults.mainText
  els.secondaryText.value = defaults.secondaryText
  els.mainFont.value = defaults.mainFont
  els.secondaryFont.value = defaults.secondaryFont
  els.mainCustomFontName.value = defaults.mainCustomFontName
  els.secondaryCustomFontName.value = defaults.secondaryCustomFontName
  els.mainFontFile.value = ""
  els.secondaryFontFile.value = ""
  els.mainColor.value = defaults.mainColor
  els.secondaryColor.value = defaults.secondaryColor
  els.bgColor.value = defaults.bgColor
  els.transparentBg.checked = defaults.transparentBg
  els.mainSize.value = defaults.mainSize
  els.secondarySize.value = defaults.secondarySize
  els.padY.value = defaults.padY
  els.padX.value = defaults.padX
  els.lockPadding.checked = defaults.lockPadding
  els.borderRadius.value = defaults.borderRadius
  els.resolutionPreset.value = defaults.resolutionPreset
  els.exportWidth.value = defaults.exportWidth
  els.exportHeight.value = defaults.exportHeight
  els.lockAspectRatio.checked = defaults.lockAspectRatio
  fontState.mainUpload = null
  fontState.secondaryUpload = null
  fontState.aspectRatio = defaults.exportWidth / defaults.exportHeight
  document.querySelector(
    `input[name="downloadFormat"][value="${defaults.downloadFormat}"]`,
  ).checked = true
  updatePreview()
}

function getFormat() {
  return document.querySelector('input[name="downloadFormat"]:checked').value
}

function updateResolutionFromPreset() {
  const preset = els.resolutionPreset.value
  if (preset === "custom") return
  const [w, h] = preset.split("x").map(Number)
  els.exportWidth.value = w
  els.exportHeight.value = h
  fontState.aspectRatio = w / h
}

function updatePreview() {
  els.logoMain.textContent = els.mainText.value || " "
  els.logoSecondary.textContent = els.secondaryText.value || " "
  els.logoMain.style.fontFamily = getMainFontChoice()
  els.logoSecondary.style.fontFamily = getSecondaryFontChoice()
  els.logoMain.style.color = els.mainColor.value
  els.logoSecondary.style.color = els.secondaryColor.value
  els.logoMain.style.fontSize = `${Number(els.mainSize.value || 0)}px`
  els.logoSecondary.style.fontSize = `${Number(els.secondarySize.value || 0)}px`
  els.logoCard.style.paddingTop = `${Number(els.padY.value || 0)}rem`
  els.logoCard.style.paddingBottom = `${Number(els.padY.value || 0)}rem`
  els.logoCard.style.paddingLeft = `${Number(els.padX.value || 0)}rem`
  els.logoCard.style.paddingRight = `${Number(els.padX.value || 0)}rem`
  els.logoCard.style.background = els.transparentBg.checked
    ? "transparent"
    : els.bgColor.value
  els.logoCard.style.borderRadius = `${Number(els.borderRadius.value || 0)}px`

  requestAnimationFrame(() => {
    requestAnimationFrame(fitPreview)
  })
}

async function handleFontUpload(file, slot) {
  if (!file) {
    fontState[slot] = null
    updatePreview()
    return
  }

  const dataUrl = await fileToDataUrl(file)
  const uniqueFamily = `UploadedFont_${slot}_${Date.now()}`
  const format = fontFormatFromName(file.name)

  const style = document.createElement("style")
  style.textContent = `
    @font-face {
      font-family: '${uniqueFamily}';
      src: url('${dataUrl}') format('${format}');
      font-weight: normal;
      font-style: normal;
    }
  `
  document.head.appendChild(style)

  fontState[slot] = {
    family: uniqueFamily,
    dataUrl,
    format,
    styleElement: style,
  }

  document.fonts?.ready?.then(() => {
    updatePreview()
  }) || updatePreview()
}

async function ensurePresetFontData() {
  if (!fontState.mainPreset) {
    fontState.mainPreset = {
      family: "stopregular",
      dataUrl: await pathToDataUrl("./fonts/stopregular.otf"),
      format: "opentype",
    }
  }

  if (!fontState.secondaryPreset) {
    fontState.secondaryPreset = {
      family: "BeckerGothics-Stencil",
      dataUrl: await pathToDataUrl("./fonts/BeckerGothics-Stencil.ttf"),
      format: "truetype",
    }
  }
}

async function buildSVG() {
  await ensurePresetFontData()

  const rect = els.logoCard.getBoundingClientRect()
  const width = Math.ceil(rect.width)
  const height = Math.ceil(rect.height)
  const mainStyle = getComputedStyle(els.logoMain)
  const secondaryStyle = getComputedStyle(els.logoSecondary)
  const cardStyle = getComputedStyle(els.logoCard)

  const mainCenterX = width / 2
  const topPad = parseFloat(cardStyle.paddingTop)
  const mainFontSize = parseFloat(mainStyle.fontSize)
  const secondaryFontSize = parseFloat(secondaryStyle.fontSize)
  const mainLineHeight = parseFloat(mainStyle.lineHeight) || mainFontSize * 0.85
  const secondaryMarginTop = parseFloat(secondaryStyle.marginTop) || 0

  const mainY = topPad + mainFontSize * 0.82
  const secondaryY =
    topPad + mainLineHeight + secondaryMarginTop + secondaryFontSize * 0.84

  const bgRect = els.transparentBg.checked
    ? ""
    : `<rect x="0" y="0" width="${width}" height="${height}" rx="${Number(els.borderRadius.value || 0)}" ry="${Number(els.borderRadius.value || 0)}" fill="${escapeXml(els.bgColor.value)}" />`

  const fontFaceRules = []
  const embedded = new Map()
  const maybeAddFontFace = (fontInfo) => {
    if (
      !fontInfo?.family ||
      !fontInfo?.dataUrl ||
      embedded.has(fontInfo.family)
    )
      return
    embedded.set(fontInfo.family, true)
    fontFaceRules.push(`
      @font-face {
        font-family: '${fontInfo.family}';
        src: url('${fontInfo.dataUrl}') format('${fontInfo.format || "truetype"}');
        font-weight: normal;
        font-style: normal;
      }
    `)
  }

  if (getMainFontChoice() === "stopregular")
    maybeAddFontFace(fontState.mainPreset)
  if (getMainFontChoice() === "BeckerGothics-Stencil")
    maybeAddFontFace(fontState.secondaryPreset)
  if (getSecondaryFontChoice() === "stopregular")
    maybeAddFontFace(fontState.mainPreset)
  if (getSecondaryFontChoice() === "BeckerGothics-Stencil")
    maybeAddFontFace(fontState.secondaryPreset)
  maybeAddFontFace(fontState.mainUpload)
  maybeAddFontFace(fontState.secondaryUpload)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      ${fontFaceRules.join("\n")}
      .main {
        font-family: ${toCssFontFamily(getMainFontChoice())};
        font-size: ${mainFontSize}px;
        fill: ${els.mainColor.value};
      }
      .secondary {
        font-family: ${toCssFontFamily(getSecondaryFontChoice())};
        font-size: ${secondaryFontSize}px;
        fill: ${els.secondaryColor.value};
      }
    </style>
  </defs>
  ${bgRect}
  <text x="${mainCenterX}" y="${mainY}" text-anchor="middle" class="main">${escapeXml(els.mainText.value || " ")}</text>
  <text x="${mainCenterX}" y="${secondaryY}" text-anchor="middle" class="secondary">${escapeXml(els.secondaryText.value || " ")}</text>
</svg>`
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadSVG() {
  const svgText = await buildSVG()
  downloadBlob(
    new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
    "logo.svg",
  )
}

async function downloadPNG() {
  const svgText = await buildSVG()
  const width = Number(els.exportWidth.value || defaults.exportWidth)
  const height = Number(els.exportHeight.value || defaults.exportHeight)
  const img = new Image()
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(svgBlob)

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (!els.transparentBg.checked) {
    ctx.fillStyle = els.bgColor.value
    ctx.fillRect(0, 0, width, height)
  }

  const sourceWidth = img.width
  const sourceHeight = img.height
  const scale = Math.min(width / sourceWidth, height / sourceHeight)
  const drawWidth = sourceWidth * scale
  const drawHeight = sourceHeight * scale
  const x = (width - drawWidth) / 2
  const y = (height - drawHeight) / 2
  ctx.drawImage(img, x, y, drawWidth, drawHeight)

  URL.revokeObjectURL(url)

  canvas.toBlob((blob) => {
    if (!blob) return
    downloadBlob(blob, "logo.png")
  }, "image/png")
}

async function handleDownload() {
  const format = getFormat()
  if (format === "svg") {
    await downloadSVG()
    return
  }
  await downloadPNG()
}

function syncPadding(source) {
  if (!els.lockPadding.checked) return
  if (source === "padX") {
    els.padY.value = els.padX.value
  } else {
    els.padX.value = els.padY.value
  }
}

function syncResolution(source) {
  if (!els.lockAspectRatio.checked) return
  const ratio =
    fontState.aspectRatio || defaults.exportWidth / defaults.exportHeight

  if (source === "width") {
    const w = Number(els.exportWidth.value || defaults.exportWidth)
    els.exportHeight.value = Math.max(100, Math.round(w / ratio))
  } else {
    const h = Number(els.exportHeight.value || defaults.exportHeight)
    els.exportWidth.value = Math.max(100, Math.round(h * ratio))
  }
}

;[
  els.mainText,
  els.secondaryText,
  els.mainFont,
  els.secondaryFont,
  els.mainCustomFontName,
  els.secondaryCustomFontName,
  els.mainColor,
  els.secondaryColor,
  els.bgColor,
  els.transparentBg,
  els.mainSize,
  els.secondarySize,
  els.borderRadius,
].forEach((el) => {
  el.addEventListener("input", updatePreview)
  el.addEventListener("change", updatePreview)
})

els.padX.addEventListener("input", () => {
  syncPadding("padX")
  updatePreview()
})

els.padY.addEventListener("input", () => {
  syncPadding("padY")
  updatePreview()
})

els.lockPadding.addEventListener("change", () => {
  if (els.lockPadding.checked) {
    els.padY.value = els.padX.value
    updatePreview()
  }
})

els.resolutionPreset.addEventListener("change", () => {
  updateResolutionFromPreset()
})

els.exportWidth.addEventListener("input", () => {
  els.resolutionPreset.value = "custom"
  syncResolution("width")
})

els.exportHeight.addEventListener("input", () => {
  els.resolutionPreset.value = "custom"
  syncResolution("height")
})

els.lockAspectRatio.addEventListener("change", () => {
  const w = Number(els.exportWidth.value || defaults.exportWidth)
  const h = Number(els.exportHeight.value || defaults.exportHeight)
  fontState.aspectRatio = w / h
})

els.mainFontFile.addEventListener("change", async (event) => {
  await handleFontUpload(event.target.files?.[0], "mainUpload")
})

els.secondaryFontFile.addEventListener("change", async (event) => {
  await handleFontUpload(event.target.files?.[0], "secondaryUpload")
})

els.downloadBtn.addEventListener("click", async () => {
  try {
    await handleDownload()
  } catch (error) {
    console.error(error)
    alert("Não foi possível gerar o arquivo.")
  }
})

els.resetBtn.addEventListener("click", setDefaults)

window.addEventListener("resize", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(fitPreview)
  })
})

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(fitPreview)
  })
})

document.fonts?.ready?.then(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(fitPreview)
  })
})

document.fonts?.addEventListener?.("loadingdone", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(fitPreview)
  })
})

setDefaults()
