import CardModel from "../../model/cardModel";
import { httpCode } from "../../constants/httpCode";
import { Request, Response, NextFunction } from 'express'

const createCard = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { id: userId } = req.user
        const createdCard = await CardModel.create({ ...req.body, owner: userId })
        return res.status(httpCode.CREATED).json({
            status: 'success',
            code: httpCode.CREATED,
            cardData: createdCard,
        });
    } catch (err: any) {
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            code: httpCode.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

const updateCard = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { id: userId } = req.user;
        const card = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: 'error',
                code: httpCode.BAD_REQUEST,
                message: "Id is'nt indicated",
            });
        }
        const cardForUpdate = {
            word: card.word,
            translation: card.translation,
            description: card.description,
            synonyms: card.synonyms,
            set: card.set
        }
        const updatedCard = await CardModel
            .findOneAndUpdate({ _id: id, owner: userId }, { ...cardForUpdate }, { new: true })
        return res.status(httpCode.OK).json({
            status: 'success',
            code: httpCode.OK,
            cardData: updatedCard,
        });
    } catch (err: any) {
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            code: httpCode.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

const deleteCard = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { id: userId } = req.user;
        const { id } = req.params;
        if (!id) {
            return res.status(httpCode.BAD_REQUEST).json({
                status: 'error',
                code: httpCode.BAD_REQUEST,
                message: "Id is'nt indicated",
            });
        }
        const deletedCard = await CardModel
            .findOneAndRemove({
                _id: id,
                owner: userId,
            })
        if (!deletedCard) {
            return res.status(httpCode.NOT_FOUND).json({
                status: 'error',
                code: httpCode.NOT_FOUND,
                message: 'Transaction not found',
            });
        }
        return res.status(httpCode.OK).json({
            status: 'success',
            code: httpCode.OK,
            cardData: deletedCard,
        });
    } catch (err: any) {
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            code: httpCode.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

const listCard = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { id: userId } = req.user;
        const { set } = req.query;
        let listCard
        if (set) {
            listCard = await CardModel.find({ owner: userId, set })
        } else {
            listCard = await CardModel.find({ owner: userId })
        }
        return res.status(httpCode.OK).json({
            status: 'success',
            code: httpCode.OK,
            cardData: listCard,
        });
    } catch (err: any) {
        console.log('🚀err', err)
        return res.status(httpCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            code: httpCode.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

export { createCard, updateCard, deleteCard, listCard }