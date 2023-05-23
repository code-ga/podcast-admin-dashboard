import { Express } from 'express';
import playlistController from './playlist.router';
import {
	Controller,
	ControllerDocumentRouterHandler,
} from '../helper/ControllerHelper';

const mainController = new Controller([], '/').SetSubController([
	playlistController,
]);

export default function SetupRouter(express: Express) {
	express.get('/routers', (_, res) => {
		res.json(ControllerDocumentRouterHandler.json());
	});
	mainController.SetupForRootApp('/', express);
}
