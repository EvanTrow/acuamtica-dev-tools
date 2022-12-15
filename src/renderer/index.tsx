import React from 'react';
import { createRoot } from 'react-dom/client';

import Theme from './Theme';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Theme key={0} />
  </React.StrictMode>
);

export type SettingsRow = {
  hostname: string;
  instanceLocation: string;
  buildLocation: string;
  extractMsi: boolean;
  lessmsiPath: string;
};

// calling IPC exposed from preload script
window.electron.ipcRenderer.sendMessage('getSettings', ['getSettings']);
window.electron.ipcRenderer.on('setSettings', (arg) => {
  // eslint-disable-next-line no-console
  window.appSettings = arg as SettingsRow;
});
