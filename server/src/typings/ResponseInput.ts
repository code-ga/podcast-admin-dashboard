// Source from sharproject/sharchat
/* eslint-disable @typescript-eslint/no-empty-interface */
import express from 'express';
import z from 'zod';
import { ZodParseOutputType } from '../helper/ControllerHelper';

interface BaseResponseLocals {}

interface ResponseLocalDataWhenAuth extends BaseResponseLocals {
	userId?: string;
}

interface ResponseLocalDataWhenNotAuth extends BaseResponseLocals {}

type ResponseLocalData<auth = false> = auth extends true
	? ResponseLocalDataWhenAuth
	: ResponseLocalDataWhenNotAuth;

export type Response<auth = false, ResBody = unknown> = express.Response<
	ResBody,
	ResponseLocalData<auth>
>;

export type Request<
	auth = false,
	ReqParam extends z.ZodRawShape = Record<string, z.ZodTypeAny>,
	ResBody = unknown,
	ReqBody extends z.ZodRawShape = Record<string, z.ZodTypeAny>,
	ReqQuery extends z.ZodRawShape = Record<string, z.ZodTypeAny>
> = express.Request<
	ZodParseOutputType<ReqParam>,
	ResBody,
	ZodParseOutputType<ReqBody>,
	ZodParseOutputType<ReqQuery>,
	ResponseLocalData<auth>
>;
