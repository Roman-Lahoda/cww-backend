import jwt from 'jsonwebtoken';
import UserModel from "../../model/userModel";

interface IUser {
    email: string,
    password: string
    id?: string
}

const isUserExist = async (email: string) => {
    const user = await UserModel.findOne({ email });
    return !!user;
}

const create = async (body: IUser): Promise<IUser> => {
    const user = new UserModel(body);
    return await user.save();
}

const getUser = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email });
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword) {
        return null;
    }
    return user;
}

const getToken = (user: IUser) => {
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
    return token;
}

const setToken = async (id: string, token: string) => {
    await UserModel.findOneAndUpdate({ _id: id }, { token }, { new: true });
}

export default {
    isUserExist,
    create,
    getUser,
    getToken,
    setToken
}