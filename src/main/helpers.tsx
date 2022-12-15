import { BrowserWindow } from 'electron';
import sqlite from 'sqlite3';

import { AlertColor } from '@mui/material/Alert';

export function GetSettings(db: sqlite.Database, mainWindow: BrowserWindow) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM settings', [], (err, rows) => {
      if (err) {
        reject(err.message.toString());
      } else {
        var settings = rows[0];
        resolve({
          ...settings,
          extractMsi: settings.extractMsi == 1 ? true : false,
        });
      }
    });
  });
}

export function SendToast(
  mainWindow: BrowserWindow,
  message: string,
  severity: AlertColor
) {
  mainWindow.webContents.send('alert', {
    open: true,
    text: message,
    severity: severity,
  });
}
