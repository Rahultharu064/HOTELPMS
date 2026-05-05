import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
export declare const errorHandler: (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorMiddleware.d.ts.map