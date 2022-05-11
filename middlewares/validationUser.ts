import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const userCreateSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).optional(),
})


export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userCreateSchema.validateAsync(req.body)
    } catch (err: any) {
        return res
            .status(400)
            .json({ message: `Field : ${err.message.replace(/"/g, '')}` })
    }
    next()
}

