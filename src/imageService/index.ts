// sharp für bilder manipulation verwenden

import sharp from 'sharp';
import fetch from 'node-fetch';

import { ImageCacheStorage } from '../cacheStorage';
import { ImageInfo } from '../cacheStorage/types';


const CacheLifetime = 86400000; // 1 tag in ms

export async function resizeImageFromUrl(url: string, width: number, height: number): Promise<Buffer | undefined> {
  try {
    let buffer: Buffer;

    const cachedImageDate = await ImageCacheStorage.getCachedImageDate(url);

    if(cachedImageDate && cachedImageDate + CacheLifetime > Date.now()) {
      buffer = await ImageCacheStorage.getCachedImageBuffer(url); // fetch from cache
    } else {
      // fetch from url and save in cache
      const response = await fetch(url);
      buffer = await response.buffer();
      ImageCacheStorage.saveImageInCache(url, buffer);
    }

    const resizedImageBuffer = await sharp(buffer).resize(width, height, {fit: 'inside'}).toBuffer(); // resize
    
    return resizedImageBuffer;
  } catch(e) {
    // unexpected error - attempt again but only from cache

    const buffer = await ImageCacheStorage.getCachedImageBuffer(url);
    if(buffer) {
      const resizedImageBuffer = await sharp(buffer).resize(width, height, {fit: 'inside'}).toBuffer();
      return resizedImageBuffer;
    }

    return undefined;
  }
}

export async function getCachedImageList(): Promise<ImageInfo[]> {
  return await ImageCacheStorage.listImages();
}

export async function resizeBufferFromImage(buffer: Buffer, width: number, height: number): Promise<Buffer> {
  return await sharp(buffer).resize(width, height).toBuffer();
}

export async function deleteCachedImage(url: string): Promise<boolean> {
  return await ImageCacheStorage.deleteCachedImage(url);
}
