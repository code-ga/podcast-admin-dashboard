import { z } from 'zod';
import {
	ControllerRequestMethod,
	ControllerType,
	HandlerFunctionType,
	RequestInput,
	TControllerMiddlewareFn,
} from './ControllerHelper';

export class ControllerBuilder<
	BT extends z.ZodRawShape,
	QT extends z.ZodRawShape,
	PT extends z.ZodRawShape,
	TResponse,
	auth = false
> {
	RequestBody?: RequestInput<BT>;
	RequestQuery?: RequestInput<QT>;
	RequestParam?: RequestInput<PT>;
	public handlerFunction?: HandlerFunctionType<BT, QT, PT, TResponse, auth>;
	constructor(public ControllerName: string) {
		this.handlerFunction = () => {
			/**pass */
		};
	}

	setRequestBodyType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<T, QT, PT, TResponse, auth> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		///@ts-ignore
		this.RequestBody = z.object(t);
		return this as unknown as ControllerBuilder<T, QT, PT, TResponse, auth>;
	}
	setRequestQueryType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<BT, T, PT, TResponse, auth> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		///@ts-ignore
		this.RequestQuery = z.object(t);
		return this as unknown as ControllerBuilder<BT, T, PT, TResponse, auth>;
	}
	setRequestParamType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<BT, QT, T, TResponse, auth> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		///@ts-ignore
		this.RequestParam = z.object(t);
		return this as unknown as ControllerBuilder<BT, QT, T, TResponse, auth>;
	}

	setTResponseType<T>(): ControllerBuilder<BT, QT, PT, T, auth> {
		return this as unknown as ControllerBuilder<BT, QT, PT, T, auth>;
	}

	addHandlerFunction(fn: HandlerFunctionType<BT, QT, PT, TResponse, auth>) {
		this.handlerFunction = fn;
		return this;
	}
	enableAuth(): ControllerBuilder<BT, QT, PT, TResponse, true> {
		return this;
	}
	disableAuth(): ControllerBuilder<BT, QT, PT, TResponse, false> {
		return this;
	}

	RequestMethod?: ControllerRequestMethod;
	setRequestMethod(method: ControllerRequestMethod) {
		this.RequestMethod = method;
		return this;
	}

	Middleware?: TControllerMiddlewareFn[];
	setMiddleware(middleware: TControllerMiddlewareFn[]) {
		this.Middleware = middleware;
		return this;
	}
	BlockOtherMiddleware?: boolean;
	setBlockOtherMiddleware(BlockOtherMiddleware: boolean) {
		this.BlockOtherMiddleware = BlockOtherMiddleware;
		return this;
	}
	spacingName?: string;
	setSpacingName(spacingName: string) {
		this.spacingName = spacingName;
		return this;
	}
	description?: string;
	setDescription(description: string) {
		this.description = description;
		return this;
	}
	SkipMiddlewareName?: string[];
	setSkipMiddlewareName(SkipMiddlewareName: string[]) {
		this.SkipMiddlewareName = SkipMiddlewareName;
		return this;
	}

	finish() {
		const result = this.handlerFunction as ControllerType<
			BT,
			QT,
			PT,
			TResponse,
			auth
		>;
		result.ControllerName = this.ControllerName;
		if (this.RequestBody) result.RequestBody = this.RequestBody;
		if (this.RequestQuery) result.RequestQuery = this.RequestQuery;
		if (this.RequestParam) result.RequestParam = this.RequestParam;
		if (this.RequestMethod) result.RequestMethod = this.RequestMethod;
		if (this.Middleware) result.Middleware = this.Middleware;
		if (this.BlockOtherMiddleware)
			result.BlockOtherMiddleware = this.BlockOtherMiddleware;
		if (this.spacingName) result.spacingName = this.spacingName;
		if (this.description) result.description = this.description;
		if (this.SkipMiddlewareName)
			result.SkipMiddlewareName = this.SkipMiddlewareName;
		return result;
	}
}
