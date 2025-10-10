import type {Response} from 'express';

import type {ResponseType} from '../types/http-responses.js';

const sendResponse = (
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data: object = {}
): void => {
    const response: ResponseType = {success, message, data};
    res.status(statusCode).json(response);
};

export const sendSuccess = (
    res: Response,
    statusCode: number,
    message: string,
    data: object
): void => {
    sendResponse(res, statusCode, true, message, data);
};

export const sendError = (
    res: Response,
    statusCode: number,
    message: string
): void => {
    sendResponse(res, statusCode, false, message);
};
