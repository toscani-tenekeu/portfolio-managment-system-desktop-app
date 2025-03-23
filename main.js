const { app, BrowserWindow } = require('electron');
const path = require('path');

function checkInternetConnection() {
  return new Promise((resolve) => {
    // Check connection to a reliable external service
    fetch('https://www.google.com/favicon.ico', { 
      method: 'HEAD',
      timeout: 5000 // 5 second timeout
    })
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280, // Set minimum width
    minHeight: 720, // Set minimum height
    icon: path.join(__dirname, 'build/icon.ico'),
    frame: true, // Set to false for frameless window
    titleBarStyle: 'hidden', // Options: 'default', 'hidden', 'hiddenInset'
    titleBarOverlay: {
      color: '#075e54',
      symbolColor: '#ece5dd',
      height: 32
    },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, 
    },
  });

  // Load the loading screen first
  win.loadFile('loading.html');

  // Load the main URL and show window when ready
  const loadMainContent = async () => {
    const isOnline = await checkInternetConnection();
    
    if (!isOnline) {
      win.loadFile('error.html');
      return;
    }

    win.loadURL('http://free-backend.great-site.net/portfolio-website-php-mysql');
    
    win.webContents.on('did-finish-load', () => {
      win.show();
    });

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorDescription);
      win.loadFile('error.html');
    });
  };

  // Wait a bit to show loading screen before loading main content
  setTimeout(loadMainContent, 8000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});