import { InstanceRow, SettingsRow } from './types';

// declare global {
//   interface Window {
//     electron: {
//       ipcRenderer: {
//         invoke(channel: string, args: unknown[]): Promise<boolean>;
//         sendMessage(channel: string, args: unknown[]): void;
//         on(
//           channel: string,
//           func: (...args: unknown[]) => void
//         ): (() => void) | undefined;
//         once(channel: string, func: (...args: unknown[]) => void): void;
//       };
//     };
//     appSettings: SettingsRow;
//   }
// }

// export {};

export interface IElectronAPI {
  windowEvents: (action: string) => void;

  getSettings: () => Promise<SettingsRow>;
  checkPath: (filePath: string) => Promise<boolean>;
  execSQL: (query: string) => void;
  getInstances: () => Promise<InstanceRow[]>;
  getBuilds: () => Promise<string[]>;

  events: {
    sendMessage(channel: string, args: unknown[]): void;
    on(
      channel: string,
      func: (...args: unknown[]) => void
    ): (() => void) | undefined;
    once(channel: string, func: (...args: unknown[]) => void): void;
  };
}
declare global {
  interface Window {
    electronAPI: IElectronAPI;
    appSettings: SettingsRow;
  }
}
