import { ipcMain } from 'electron';
import sqlite from 'sqlite3';

import GetInstances from './actions/getInstances';

export default class IpcBuilder {
  db: sqlite.Database;

  constructor(db: sqlite.Database) {
    this.db = db;
  }

  buildIpc() {
    ipcMain.on('getSettings', async (event, arg) => {
      this.db.all('SELECT * FROM settings', [], (err, rows) => {
        if (err) {
          console.error(err.message);
          event.reply('alert', {
            open: true,
            text: 'IPC Error! getSettings > ' + err.message,
            severity: 'error',
          });
        } else {
          event.reply('setSettings', rows[0]);
        }
      });
    });

    ipcMain.on('getInstances', async (event, arg) => {
      this.db.all('SELECT * FROM instances', [], (err, rows) => {
        if (err) {
          console.error(err.message);
          event.reply('alert', {
            open: true,
            text: 'IPC Error! getInstances > ' + err.message,
            severity: 'error',
          });
        }

        if (rows.length > 0) {
          event.reply('setInstances', rows);
        }
      });
    });
  }
}
