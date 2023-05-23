import express from 'express';
import http from 'http';
import SetupRouter from './routers';

const app = express();
const server = http.createServer(app);

SetupRouter(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
	console.log(`Server started at port: ${PORT}`);
});
