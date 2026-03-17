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

function cloneForExport() {
  const clone = els.logoCard.cloneNode(true)

  const computedCard = getComputedStyle(els.logoCard)
  const computedMain = getComputedStyle(els.logoMain)
  const computedSecondary = getComputedStyle(els.logoSecondary)

  clone.style.margin = "0"
  clone.style.transform = "none"
  clone.style.maxWidth = "none"
  clone.style.maxHeight = "none"
  clone.style.overflow = "visible"
  clone.style.boxSizing = "border-box"
  clone.style.display = "inline-flex"
  clone.style.flexDirection = "column"
  clone.style.alignItems = "center"
  clone.style.justifyContent = "center"
  clone.style.paddingTop = computedCard.paddingTop
  clone.style.paddingBottom = computedCard.paddingBottom
  clone.style.paddingLeft = computedCard.paddingLeft
  clone.style.paddingRight = computedCard.paddingRight
  clone.style.background = computedCard.backgroundColor
  clone.style.borderRadius = computedCard.borderRadius

  const cloneMain = clone.querySelector("#logoMain")
  const cloneSecondary = clone.querySelector("#logoSecondary")

  cloneMain.style.fontFamily = computedMain.fontFamily
  cloneMain.style.fontSize = computedMain.fontSize
  cloneMain.style.lineHeight = computedMain.lineHeight
  cloneMain.style.color = computedMain.color
  cloneMain.style.margin = computedMain.margin
  cloneMain.style.whiteSpace = "nowrap"

  cloneSecondary.style.fontFamily = computedSecondary.fontFamily
  cloneSecondary.style.fontSize = computedSecondary.fontSize
  cloneSecondary.style.lineHeight = computedSecondary.lineHeight
  cloneSecondary.style.color = computedSecondary.color
  cloneSecondary.style.margin = computedSecondary.margin
  cloneSecondary.style.whiteSpace = "nowrap"

  const sandbox = document.createElement("div")
  sandbox.style.position = "fixed"
  sandbox.style.left = "-100000px"
  sandbox.style.top = "0"
  sandbox.style.padding = "0"
  sandbox.style.margin = "0"
  sandbox.style.background = "transparent"
  sandbox.style.zIndex = "-1"
  sandbox.style.overflow = "visible"
  sandbox.appendChild(clone)
  document.body.appendChild(sandbox)

  return { sandbox, clone }
}

function getNaturalExportSize(node) {
  const width = Math.ceil(node.scrollWidth)
  const height = Math.ceil(node.scrollHeight)
  return { width, height }
}

function getTargetExportSize(naturalWidth, naturalHeight) {
  const maxWidth = Number(els.exportWidth.value || defaults.exportWidth)
  const maxHeight = Number(els.exportHeight.value || defaults.exportHeight)

  if (!naturalWidth || !naturalHeight) {
    return { width: maxWidth, height: maxHeight }
  }

  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight)

  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale)),
  }
}

function downloadDataUrl(dataUrl, fileName) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = fileName
  a.click()
}

async function exportNodeAs(format) {
  const { sandbox, clone } = cloneForExport()

  try {
    await document.fonts.ready

    const natural = getNaturalExportSize(clone)
    const target = getTargetExportSize(natural.width, natural.height)

    const scale = target.width / natural.width

    const options = {
      width: target.width,
      height: target.height,
      bgcolor: els.transparentBg.checked ? "transparent" : els.bgColor.value,
      style: {
        margin: "0",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${natural.width}px`,
        height: `${natural.height}px`,
        overflow: "visible",
      },
    }

    if (format === "svg") {
      const dataUrl = await domtoimage.toSvg(clone, options)
      downloadDataUrl(dataUrl, "logo.svg")
      return
    }

    const dataUrl = await domtoimage.toPng(clone, options)
    downloadDataUrl(dataUrl, "logo.png")
  } finally {
    sandbox.remove()
  }
}

async function handleDownload() {
  const format = getFormat()
  await exportNodeAs(format)
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
