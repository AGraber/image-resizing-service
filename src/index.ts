import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Config } from './config';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(router);

app.listen(Config.ListenPort, () => {
  console.log('Started listening on port ' + Config.ListenPort);
});
