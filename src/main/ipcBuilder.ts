import { BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import sqlite from 'sqlite3';

import { SendToast } from './helpers';

export default class IpcBuilder {
  app: Electron.App;
  db: sqlite.Database;
  mainWindow: BrowserWindow;

  constructor(
    app: Electron.App,
    mainWindow: BrowserWindow,
    db: sqlite.Database
  ) {
    this.app = app;
    this.db = db;
    this.mainWindow = mainWindow;
  }

  buildIpc() {
    ipcMain.handle('windowEvents', (event, action) => {
      console.log(action);
      switch (action) {
        case 'close':
          this.mainWindow.hide();
          break;
        case 'maximize':
          if (this.mainWindow.isMaximized()) {
            this.mainWindow.unmaximize();
          } else {
            this.mainWindow.maximize();
          }
          break;
        case 'minimize':
          this.mainWindow.minimize();
          break;
      }
      return;
    });

    ipcMain.handle('getSettings', async (event) => {
      return new Promise((resolve, reject) => {
        this.db.all('SELECT * FROM settings', [], (err, rows) => {
          if (err) {
            SendToast(
              this.mainWindow,
              'IPC Error! getSettings > ' + err.message,
              'error'
            );
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
    });

    ipcMain.handle('checkPath', (event, arg) => {
      try {
        console.log(arg, fs.existsSync(arg));
        return fs.existsSync(arg);
      } catch (e) {
        SendToast(
          this.mainWindow,
          'IPC Error! checkPath > ' + (e as Error).message,
          'error'
        );
        return false;
      }
    });

    ipcMain.on('execSQL', (event, query) => {
      try {
        this.db.all(query, [], (err, rows) => {
          if (err) {
            console.error(err.message);
            SendToast(
              this.mainWindow,
              'IPC Error! sql > ' + err.message,
              'error'
            );
          }
        });
      } catch (e) {
        SendToast(
          this.mainWindow,
          'IPC Error! sql > ' + (e as Error).message,
          'error'
        );
      }
    });

    ipcMain.handle('getInstances', async (event) => {
      return new Promise((resolve, reject) => {
        this.db.all('SELECT * FROM instances', [], (err, rows) => {
          if (err) {
            SendToast(
              this.mainWindow,
              'IPC Error! getInstances > ' + err.message,
              'error'
            );
            reject(err.message.toString());
          } else {
            resolve(rows);
          }
        });
      });
    });

    ipcMain.handle('getBuilds', async (event) => {
      return new Promise((resolve, reject) => {
        try {
          this.db.all(
            'SELECT buildLocation FROM settings',
            [],
            async (err, rows) => {
              if (err) {
                SendToast(
                  this.mainWindow,
                  'IPC Error! getBuilds > ' + err.message,
                  'error'
                );
                reject(err.message.toString());
              } else {
                let folders: string[] = await fs.promises.readdir(
                  rows[0].buildLocation
                );

                resolve(folders);
              }
            }
          );
        } catch (e) {
          console.log(e);

          SendToast(
            this.mainWindow,
            'IPC Error! sql > ' + (e as Error).message,
            'error'
          );
        }
      });
    });
  }
}
