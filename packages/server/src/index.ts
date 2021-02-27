import express from 'express';
import path from 'path';
import { initSocket } from './sockets';

const app = express();

app.use(express.static(path.resolve(__dirname, '../../client/build')));

const httpServer = app.listen(8080);
console.info('Magic things are happening at port:', 8080);

initSocket(httpServer);
