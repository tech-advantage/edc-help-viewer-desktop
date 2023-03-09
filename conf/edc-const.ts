import { rootPath } from 'electron-root-path';
import { homedir } from 'os';

export const APP_ROOT = rootPath;
export const USER_HOME_DIR = homedir();
