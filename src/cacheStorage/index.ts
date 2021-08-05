//import { FsCacheStorage as ImageCacheStorageImplementation } from './fsCache'; // file baed cache
import { MySQLCacheStorage as ImageCacheStorageImplementation } from './mysqlCache';
import { ImageCacheStorageType } from './types';

export const ImageCacheStorage: ImageCacheStorageType = new ImageCacheStorageImplementation();

