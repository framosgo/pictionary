import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.listen(8080);
console.log('Magic things are happening at port:', 8080);