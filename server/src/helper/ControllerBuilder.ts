import { z } from 'zod';
import {
	ControllerType,
	HandlerFunctionType,
	RequestInput,
} from './ControllerHelper';

export class ControllerBuilder<
	BT extends z.ZodRawShape,
	QT extends z.ZodRawShape,
	PT extends z.ZodRawShape,
	auth = false
> {
	RequestBody?: RequestInput<BT>;
	RequestQuery?: RequestInput<QT>;
	RequestParam?: RequestInput<PT>;
	public handlerFunction: HandlerFunctionType<BT, QT, PT>;
	constructor(public ControllerName: string) {}

	setRequestBodyType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<T, QT, PT> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		///@ts-ignore
		this.RequestBody = z.object(t);
		return this as unknown as ControllerBuilder<T, QT, PT>;
	}
	setRequestQueryType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<BT, T, PT> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		///@ts-ignore
		this.RequestQuery = z.object(t);
		return this as unknown as ControllerBuilder<BT, T, PT>;
	}
	setRequestParamType<T extends z.ZodRawShape>(
		t: T
	): ControllerBuilder<BT, QT, T> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		///@ts-ignore
		this.RequestParam = z.object(t);
		return this as unknown as ControllerBuilder<BT, QT, T>;
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
