import fs from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';

function makeFileNameFromUrl(url: string) {
  return Buffer.from(url).toString('base64');
}

async function ensureDirectory(filePath: string): Promise<void> {
  const folderPath = path.dirname(filePath);
  try {
    await fs.access(folderPath, fsConstants.F_OK);
  } catch(e) {
    await fs.mkdir(folderPath, {recursive: true});
  }
}

function getUrlFromFileName(fileName: string): undefined | string {
  return Buffer.from(fileName, 'base64').toString();
}

export class FsCacheStorage {
  basePath: string;

  constructor() {
    this.basePath = path.join(process.cwd(), '/image_cache');
    ensureDirectory(this.basePath + '/dummy');
  }

  async getCachedImageDate(url: string): Promise<number | undefined> {
    try {
      const statResult = await fs.stat(path.join(this.basePath, makeFileNameFromUrl(url) ));
      return statResult.mtimeMs;
    } catch(e) {
      return undefined;
    }
  }

  async getCachedImageBuffer(url: string): Promise<Buffer | undefined> {
    try {
      const buffer = await fs.readFile(path.join(this.basePath, makeFileNameFromUrl(url)));
      return buffer;
    } catch(e) {
      return undefined;
    }
  }

  async deleteCachedImage(url: string): Promise<boolean> {
    const fileName = path.join(this.basePath, makeFileNameFromUrl(url));
    try {
      await fs.access(fileName, fsConstants.F_OK);
      await fs.unlink(fileName);
      return true;
    } catch(e) {
      return false;
    }
  }

  async listImages(): Promise<{url: string, date: number}[]> {
    const files = await fs.readdir(this.basePath);
    
    const fileList: {url: string, date: number}[] = [];

    for(const file of files) {
      const statResult = await fs.stat(path.join(this.basePath, file));

      const url = getUrlFromFileName(file);

      fileList.push({
        url, date: statResult.mtimeMs,
      });
    }

    return fileList;
  }

  async saveImageInCache(url: string, buffer: Buffer): Promise<void> {
    const filePath = path.join(this.basePath, makeFileNameFromUrl(url));
    await ensureDirectory(filePath);
    await fs.writeFile(filePath, buffer);
  }
}
