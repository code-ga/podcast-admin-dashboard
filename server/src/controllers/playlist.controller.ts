import { z } from 'zod';
import { Controller } from '../helper/ControllerHelper';
import { ControllerBuilder } from '../helper/ControllerBuilder';

const GetPlaylist = new ControllerBuilder('/').setRequestMethod('get').finish();

const GetSong = new ControllerBuilder('/')
	.setRequestMethod('get')
	.setRequestQueryType({
		song_id: z.string(),
	})
	.setTResponseType<{ song_id: string }>()
	.addHandlerFunction((req, res) => {
		res.send({ song_id: req.query.song_id });
	})
	.finish();

const CreatePlaylist = new ControllerBuilder('/')
	.setRequestMethod('post')
	.finish();

export const playlistController = new Controller(
	[GetPlaylist, CreatePlaylist, GetSong],
	'/playlist'
);
