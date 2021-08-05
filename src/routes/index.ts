import express from 'express';
import { deleteCachedImage, getCachedImageList, resizeImageFromUrl } from '../imageService';

export const router = express.Router();

router.get('/image/:url/:width/:height', async (req: express.Request, res: express.Response) => {
  try {
    let { url, width, height } = req.params as { url: string, width: number | string, height: number | string };

    if(typeof url !== 'string') {
      res.status(400).json({
        error: true,
        message: 'url parameter must be a string',
      });
      return;
    }

    url = decodeURIComponent(url);

    if(typeof width === 'string') {
      width = parseInt(width);
    }
    
    if(typeof width !== 'number' || isNaN(width) || width <= 0) {
      res.status(400).json({
        error: true,
        message: 'width must be a number greater than 0',
      });
      return;
    }

    if(typeof height === 'string') {
      height = parseInt(height);
    }

    if(typeof height !== 'number' || height <= 0) {
      res.status(400).json({
        error: true,
        message: 'height must be a number greater than 0',
      });
      return;
    }
    
    const resizedImageBuffer = await resizeImageFromUrl(url, width, height);
    
    if(!resizedImageBuffer) {
      res.status(503).json({
        error: true,
        message: 'Could not retrieve image from url',
      });
      return;
    }

    res.send(resizedImageBuffer);
  } catch(e) {
    res.status(503).json({
      error: true,
      message: 'Unexpected error: ' + e,
    });
  }
});

router.get('/image/list', async (req: express.Request, res: express.Response) => {
  try {
    const imageList = await getCachedImageList();
    res.json(imageList);
  } catch(e) {
    res.json({
      error: true,
      message: 'Unexpected error: ' + e,
    });
  }
});

router.delete('/image/:url', async (req: express.Request, res: express.Response) => {
  try {
    let url = req.params.url;

    if(typeof url !== 'string') {
      res.status(400).json({
        error: true,
        message: 'url parameter must be a string',
      });
      return;
    }

    url = decodeURIComponent(url.trim());

    const result = await deleteCachedImage(url);

    res.json({deleted: result});
  } catch(e) {
    res.status(503).json({
      error: true,
      message: 'Unexpected error: ' + e,
    });
  }
});
