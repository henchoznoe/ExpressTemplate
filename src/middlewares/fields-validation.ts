import type {NextFunction, Request, Response} from 'express';
import {ZodError, type ZodType} from 'zod';

import {sendError} from '../utils/http-responses.js';

export const validateFields =
    (schema: ZodType) =>
        (req: Request, res: Response, next: NextFunction): void => {
            try {
                req.body = schema.parse(req.body);
                next();
            } catch (err) {
                if (err instanceof ZodError) {
                    const messages = err.issues.map((i) => i.message).join(', ');
                    sendError(res, 400, messages);
                } else if (err instanceof Error) {
                    sendError(res, 400, err.message);
                } else {
                    sendError(res, 400, 'Unknown validation error');
                }
            }
        };