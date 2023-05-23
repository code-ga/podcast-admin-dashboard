// Source from sharproject/Sharchat

/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction } from 'express';
import { Response, Request } from '../typings/ResponseInput';
import { Router } from 'express';
import z from 'zod';
import { BasicMiddleware } from '../middlewares/basic';

type RequestInput<T> = z.ZodSchema<T>;

export interface ControllerInformation<BT, QT, PT> {
	RequestBody?: RequestInput<BT>;
	RequestQuery?: RequestInput<QT>;
	RequestParam?: RequestInput<PT>;
	// will not use if that is middleware recommend fill it empty
	ControllerName: string;
	RequestMethod?: 'get' | 'post' | 'put' | 'delete' | 'patch';
	BlockOtherMiddleware?: boolean;
	spacingName?: string;
	description?: string;
	SkipMiddlewareName?: string[];
}


export type HandlerFunctionType<BT, QT, PT, auth = false, TResponse = unknown> = (
	req: Request<auth, PT, TResponse, BT, QT>,
	res: Response<auth, TResponse>,
	next: NextFunction
) => Promise<any> | any | unknown | void | null | undefined;

export interface ControllerType<BT, QT, PT, auth = false, TResponse = unknown>
	extends ControllerInformation<BT, QT, PT> {
	(
		req: Request<auth, PT, TResponse, BT, QT>,
		res: Response<auth, TResponse>,
		next: NextFunction
	): Promise<any> | any | unknown | void | null | undefined;

	Middleware?: TControllerMiddlewareFn[];
}

export type TControllerMiddlewareFn<auth = false, TResponse = unknown> = ((
	req: Request,
	res: Response<auth, TResponse>,
	next: NextFunction
) => any) & {
	MiddlewareName: string;
	description?: string;
	CustomMiddleware?: string;
};
interface ControllerDocumentJsonReturnType {
	api: {
		[key: string]: any[];
	};
}
export class ControllerDocument {
	constructor(
		public controller: {
			name: string;
			controller: Controller;
		}[]
	) {}
	json() {
		const result = { api: {} } as ControllerDocumentJsonReturnType;
		for (const c of this.controller) {
			// group
			const controllerJson = { path: {}, middleware: {} } as any;
			for (const con of c.controller.controller) {
				const conInfo = {} as any;
				for (const k in con) {
					if (k == 'Middleware') {
						continue;
					} else {
						conInfo[k] = con[k as keyof typeof con];
					}
				}

				// parse middleware
				let middleware = con.Middleware || [];
				middleware.push(...c.controller.allMiddleware);
				middleware = middleware.filter(
					(n) =>
						![
							...c.controller.SkipMiddlewareName,
							...(con.SkipMiddlewareName || []),
						].includes(n.MiddlewareName)
				);
				const middlewareInfo = middleware.map((v) => {
					const result = {} as any;
					for (const k in v) {
						result[k] = v[k as keyof typeof v];
					}
					return result;
				});
				conInfo['Middleware'] = middlewareInfo;

				controllerJson['path'][
					con.ControllerName.startsWith('/')
						? con.ControllerName
						: `/${con.ControllerName}`
				] = conInfo;
			}
			for (const middleware of c.controller.allMiddleware) {
				const middlewareInfo = {} as any;
				for (const k in middleware) {
					middlewareInfo[k] = middleware[k as keyof typeof middleware];
				}

				controllerJson['middleware'][middleware.MiddlewareName] =
					middlewareInfo;
			}
			result.api[c.name] = controllerJson;
		}
		return result;
	}
}

// eslint-disable-next-line no-var
export var ControllerDocumentRouterHandler = new ControllerDocument([]);

export const DefaultMiddleware: TControllerMiddlewareFn[] = [BasicMiddleware];

export class Controller {
	controllers: Map<string, ControllerType<any, any, any>>;
	allMiddleware: TControllerMiddlewareFn[];
	constructor(
		public controller: ControllerType<any, any, any>[],
		public root_path: string,
		public subController: Controller[] = [],
		public SkipMiddlewareName: string[] = []
	) {
		this.controllers = new Map<string, ControllerType<any, any, any>>();
		this.allMiddleware = [...DefaultMiddleware];
		for (const c of controller) {
			this.controllers.set(c.ControllerName, c);
		}
	}
	SetupRouter(router: Router) {
		for (const [name, controller] of this.controllers) {
			let allMiddlewareList = [
				...(controller?.BlockOtherMiddleware == true ? [] : this.allMiddleware),
				...(controller.Middleware ? controller.Middleware : []),
			];
			const allSkipMiddlewareName = [
				...this.SkipMiddlewareName,
				...(controller.SkipMiddlewareName || []),
			];
			allMiddlewareList = allMiddlewareList.filter(
				(n) => !allSkipMiddlewareName.includes(n.MiddlewareName)
			);
			router[controller.RequestMethod || 'post'](
				name.startsWith('/') ? name : `/${name}`,
				...allMiddlewareList,
				this.checkRequestBody.bind(this),
				this.checkRequestQuery.bind(this),
				this.checkRequestParam.bind(this),

				controller
			);
		}
		for (const c of this.subController) {
			c.root_path =
				this.root_path +
				(c.root_path.startsWith('/') ? c.root_path : '/' + c.root_path);
			if (c.root_path.startsWith('//')) {
				c.root_path = c.root_path.slice(1);
			}
			const n_router = Router();
			c.SetupRouter(n_router);
			router.use(c.root_path, n_router);
		}
		ControllerDocumentRouterHandler.controller.push({
			name: this.root_path,
			controller: this,
		});
	}
	checkRequestBody(req: Request, res: Response<false>, next: NextFunction) {
		const controller = this.controllers.get(req.url);
		if (!controller) {
			res.status(400).json({
				message: 'Controller not found',
			});
			return;
		}
		if (controller.RequestBody) {
			const [RequestBody, error] = CheckRequestInput(
				controller.RequestBody,
				req.body
			);
			if (error) {
				res.status(error.status).send(error.message);
			}
			req.body = RequestBody;
		}
		next();
	}
	checkRequestQuery(req: Request, res: Response<false>, next: NextFunction) {
		const controller = this.controllers.get(req.url);
		if (!controller) {
			res.status(400).json({
				message: 'Controller not found',
			});
			return;
		}
		if (controller.RequestQuery) {
			const [RequestQuery, error] = CheckRequestInput(
				controller.RequestQuery,
				req.query
			);
			if (error) {
				res.status(error.status).send(error.message);
			}
			req.query = RequestQuery;
		}
		next();
	}
	checkRequestParam(req: Request, res: Response<false>, next: NextFunction) {
		const controller = this.controllers.get(req.url);
		if (!controller) {
			res.status(400).json({
				message: 'Controller not found',
			});
			return;
		}
		if (controller.RequestParam) {
			const [RequestParam, error] = CheckRequestInput(
				controller.RequestParam,
				req.query
			);
			if (error) {
				res.status(error.status).send(error.message);
			}
			req.params = RequestParam;
		}
		next();
	}
	SetupForRootApp(path: string, app: import('express').Express) {
		this.root_path = path;
		const router = Router();
		this.SetupRouter(router);
		app.use(path, router);
		return router;
	}
	SetMiddleware(allMiddleware: TControllerMiddlewareFn[]) {
		this.allMiddleware = allMiddleware;
		this.allMiddleware.push(...DefaultMiddleware);
		return this;
	}
	SetSubController(subController: Controller[]) {
		this.subController = subController;
		return this;
	}
}

type CheckRequestInputResponse<T> = [
	T | null | undefined,
	(
		| {
				status: number;
				message: string;
		  }
		| null
		| undefined
	)
];

function CheckRequestInput<T>(
	Types: RequestInput<T>,
	Data: unknown
): CheckRequestInputResponse<T> {
	const requestBody = Types.safeParse(Data);
	if (!requestBody.success) {
		return [
			null,
			{
				status: 400,
				message: 'your input type invalid',
			},
		];
	}

	return [requestBody.data, null];
}
