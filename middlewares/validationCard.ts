import Joi from "joi";
import { Request, Response, NextFunction } from 'express'

const validateCardSchema = Joi.object({
    word: Joi.string().required(),
    translation: Joi.string().required(),
    description: Joi.string().min(0),
    set: Joi.string().min(0),
    synonyms: Joi.string().min(0),
    _id: Joi.string(),
    createdAt: Joi.string(),
    updatedAt: Joi.string(),
    owner: Joi.string()
})

export const validationCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validateCardSchema.validateAsync(req.body)
    } catch (err: any) {
        return res
            .status(400)
            .json({ message: `Field : ${err.message.replace(/"/g, '')}` })
    }
    next()
}