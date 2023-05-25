// Source from sharproject/sharchat
/* eslint-disable @typescript-eslint/no-empty-interface */
import express from 'express';
import { Low } from 'lowdb/lib';

interface BaseResponseLocals {
	LowDB: Low<unknown>;
}

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
	ReqParam = unknown,
	ResBody = unknown,
	ReqBody = unknown,
	ReqQuery = unknown
> = express.Request<
	ReqParam,
	ResBody,
	ReqBody,
	ReqQuery,
	ResponseLocalData<auth>
>;
