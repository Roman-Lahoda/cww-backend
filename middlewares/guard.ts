import jwt from 'jsonwebtoken';
import { httpCode } from '../constants/httpCode';
import { Request, Response, NextFunction } from 'express'
import UserModel from '../model/userModel';

declare module 'express-serve-static-core' {
    interface Request {
        user: {
            email: string,
            password: string
            id?: string
        }
    }
}

const verifyToken = (token: string): boolean => {
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return !!verify;
    } catch (error) {
        return false;
    }
};

const guard = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('authorization')?.split(' ')[1];
    if (token) {
        const isValidToken = verifyToken(token);
        if (!isValidToken) {
            return res.status(httpCode.UNAUTHORIZED).json({
                status: 'error',
                code: httpCode.UNAUTHORIZED,
                message: 'Not authorized',
            });
        }
        interface JwtPayload {
            id: string
        }
        const payload = jwt.decode(token) as JwtPayload
        const user = await UserModel.findById({ _id: payload.id });
        if (!user || user.token !== token) {
            return res.status(httpCode.UNAUTHORIZED).json({
                status: 'error',
                code: httpCode.UNAUTHORIZED,
                message: 'Not authorized',
            });
        }
        req.user = user;
    }
    next();
};


export default guard;