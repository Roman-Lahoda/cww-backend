import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

const { Schema, model } = mongoose

interface IUser {
    email: string,
    password: string,
    token: string,
    id: string,
    isModified: (password: string) => void,
    isValidPassword: (password: string) => boolean
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String
    },
    token: {
        type: String,
        default: ''
    }
}, {
    versionKey: false,
    timestamps: true,
})

userSchema.pre('save', async function (next): Promise<void> {
    if (this.isModified('password')) {
        const salt = await bcryptjs.genSalt(6);
        this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
})

userSchema.methods.isValidPassword = async function (password: string) {
    return await bcryptjs.compare(password, this.password);
};

const UserModel = model<IUser>('user', userSchema);

export default UserModel;
