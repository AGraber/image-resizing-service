export type ImageInfo = {url: string, date: number};

export interface ImageCacheStorageType {
  getCachedImageDate(url: string): Promise<number | undefined>;
  getCachedImageBuffer(url: string): Promise<Buffer | undefined>;
  deleteCachedImage(url: string): Promise<boolean>;
  listImages(): Promise<ImageInfo[]>;
  saveImageInCache(url: string, buffer: Buffer): Promise<void>;
}
