import queryString from 'query-string';
import axios from 'axios';
import bcryptjs from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { Request, Response } from 'express';
import UserModel from '../../model/userModel.js';
import authService from '../../service/auth/authService.js';

const googleAuth = async (req: Request, res: Response) => {
    const stringifiedParams = queryString.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL}/user/google-redirect`,
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
};

const googleRedirect = async (req: Request, res: Response) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;
    const tokenData = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BASE_URL}/user/google-redirect`,
            grant_type: 'authorization_code',
            code,
        },
    });
    const userData = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${tokenData.data.access_token}`,
        },
    });
    const { email, id } = userData.data;
    const isUserExist = await authService.isUserExist(email)
    let token
    if (isUserExist) {
        const user = await authService.getUser(email, id)
        if (user) {
            token = await authService.getToken(user)
            await authService.setToken(user.id, token)
        }
    }
    if (!isUserExist) {
        const user = await authService.create({ email, password: id })
        token = await authService.getToken(user)
        if (user.id) {
            await authService.setToken(user.id, token)
        }
    }

    return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
};
export default { googleAuth, googleRedirect };
