import express from 'express';
import http from 'http';
import SetupRouter from './routers';
import path from 'path';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { defaultData } from './database';

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, defaultData);

const app = express();
app.use((_, res, next) => {
	res.locals.LowDB = db;
	console.log(res.locals)
	next();
});
const server = http.createServer(app);

SetupRouter(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
	console.log(`Server started at port: ${PORT}`);
});
