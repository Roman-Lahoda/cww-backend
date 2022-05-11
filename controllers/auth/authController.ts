import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { httpCode } from '../../constants/httpCode';
import authService from '../../service/auth/authService';

interface IUser {
    email: string,
    password: string
    id?: string
}

declare module 'express-serve-static-core' {
    interface Request {
        user: {
            email: string,
            password: string
            id?: string
        }
    }
}

const signUp = async (req: Request, res: Response, _next: NextFunction) => {
    const body: IUser = req.body
    const isUserExist = await authService.isUserExist(body.email)
    if (isUserExist) {
        return res
            .status(httpCode.CONFLICT)
            .json({ status: 'error', code: httpCode.CONFLICT, userData: { message: 'Email is already exist' } });
    }
    const user = await authService.create(req.body)
    res.status(httpCode.OK).json({ status: 'success', code: httpCode.CREATED, userData: { email: user.email } });
}

const login = async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password }: IUser = req.body;
    const user = await authService.getUser(email, password)
    if (!user) {
        return res
            .status(httpCode.UNAUTHORIZED)
            .json({ status: 'error', code: httpCode.UNAUTHORIZED, message: 'Invalid credentials' });
    }
    const token = authService.getToken(user);
    await authService.setToken(user.id, token);
    res
        .status(httpCode.OK)
        .json({ status: 'success', code: httpCode.OK, userData: { token } });
};

const logout = async (req: Request, res: Response, _next: NextFunction) => {
    if (req.user?.id) {
        await authService.setToken(req.user.id, '');
    }
    return res.status(httpCode.NO_CONTENT).json({ status: 'success', code: httpCode.NO_CONTENT });
};

export { signUp, login, logout }