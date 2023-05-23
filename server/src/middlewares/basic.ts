import { TControllerMiddlewareFn } from '../helper/ControllerHelper';

export const BasicMiddleware: TControllerMiddlewareFn = async (
	_req,
	res,
	next
) => {
	try {
		return next();
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
BasicMiddleware.MiddlewareName = 'BasicMiddleware';
BasicMiddleware.CustomMiddleware = 'Basic middleware';
BasicMiddleware.description = 'the middleware do not do anythings';
