import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'

let mainWindow
let tray
let trayTimer

async function fetchLatestFNGValue() {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1')
    const json = await res.json()
    const arr = json?.data || []
    const latest = arr[0]
    return latest ? String(latest.value) : ''
  } catch {
    return ''
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadFile('renderer/index.html')

  mainWindow.on('minimize', () => {
    if (process.platform === 'darwin') {
      ensureTray()
      mainWindow.hide()
    }
  })

  mainWindow.on('restore', () => {})

  mainWindow.on('show', () => {
    if (process.platform === 'darwin') {
      destroyTray()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', (e) => {
    if (process.platform === 'darwin' && !app.isQuiting) {
      e.preventDefault()
      mainWindow.hide()
      ensureTray()
    }
  })
}

app.whenReady().then(() => {
  app.setName('FNG')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function transparentIcon() {
  const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAMAASsJf1oAAAAASUVORK5CYII='
  return nativeImage.createFromDataURL(dataUrl)
}

async function updateTrayTitle() {
  if (!tray) return
  const v = await fetchLatestFNGValue()
  const pure = v ? String(parseInt(v, 10)) : ''
  tray.setTitle(`🌡️ ${pure}`)
}

function ensureTray() {
  if (process.platform !== 'darwin') return
  if (!tray) {
    tray = new Tray(transparentIcon())
    const menu = Menu.buildFromTemplate([
      { label: '显示窗口', click: () => { if (mainWindow) { app.dock.show(); mainWindow.show(); mainWindow.restore(); } } },
      { type: 'separator' },
      { label: '退出', click: () => { app.isQuiting = true; app.quit() } },
    ])
    tray.setContextMenu(menu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.on('click', () => {
      if (mainWindow) { app.dock.show(); mainWindow.show(); mainWindow.restore() }
    })
  }
  app.dock.hide()
  updateTrayTitle()
  clearInterval(trayTimer)
  trayTimer = setInterval(updateTrayTitle, 5 * 60 * 1000)
}

function destroyTray() {
  clearInterval(trayTimer)
  trayTimer = null
  if (tray) {
    tray.destroy()
    tray = null
  }
}