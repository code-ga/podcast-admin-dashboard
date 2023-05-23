import { z } from 'zod';
import { Controller } from '../helper/ControllerHelper';
import { ControllerBuilder } from '../helper/ControllerBuilder';

const GetPlaylist = new ControllerBuilder('/')
	.setRequestBodyType({
		data: z.string(),
	})
	.setRequestParamType({
		data: z.string(),
	})
	.setRequestQueryType({
		data: z.string(),
	})
	.addHandlerFunction((req, _res, _next) => {
		req.params.data;
	})
	.finish();

export const playlistController = new Controller([GetPlaylist], '/playlist');
