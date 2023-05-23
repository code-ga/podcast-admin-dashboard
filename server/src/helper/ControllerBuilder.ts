import { z } from 'zod';
import { ControllerType, HandlerFunctionType } from './ControllerHelper';

export class ControllerBuilder<BT, QT, PT, auth = false> {
	RequestBody?: z.ZodType<BT>;
	RequestQuery?: z.ZodType<QT>;
	RequestParam?: z.ZodType<PT>;
	public handlerFunction: HandlerFunctionType<BT, QT, PT>;
	constructor(public ControllerName: string) {}

	setRequestBodyType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<T, QT, PT> {
		const newBuilder: ControllerBuilder<T, QT, PT> = {
			...this,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			///@ts-ignore
			RequestBody: z.object(t),
		};
		return newBuilder;
	}
	setRequestQueryType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<BT, T, PT> {
		const newBuilder: ControllerBuilder<BT, T, PT> = {
			...this,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			///@ts-ignore
			RequestQuery: z.object(t),
		};
		return newBuilder;
	}
	setRequestParamType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<BT, QT, T> {
		const newBuilder: ControllerBuilder<BT, QT, T> = {
			...this,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			///@ts-ignore
			RequestParam: z.object(t),
		};
		return newBuilder;
	}

	addHandlerFunction(fn: HandlerFunctionType<BT, QT, PT>) {
		this.handlerFunction = fn;
		return this;
	}
	enableAuth(): ControllerBuilder<BT, QT, PT, true> {
		return this;
	}
	disableAuth(): ControllerBuilder<BT, QT, PT, false> {
		return this;
	}

	finish() {
		const result = this.handlerFunction as ControllerType<BT, QT, PT, auth>;
		result.ControllerName = this.ControllerName;
		if (this.RequestBody) {
			result.RequestBody = this.RequestBody;
		}
		if (this.RequestQuery) {
			result.RequestQuery = this.RequestQuery;
		}
		if (this.RequestParam) {
			result.RequestParam = this.RequestParam;
		}
		return result;
	}
}
