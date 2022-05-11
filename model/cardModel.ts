import mongoose from 'mongoose';
const { Schema, model, SchemaTypes } = mongoose;

interface ICard {
    word: string,
    translation: string,
    description: string,
    set: string,
    synonyms: string,
    owner: string
}

const cardSchema = new Schema<ICard>({
    word: { type: String, required: true },
    translation: { type: String, required: true },
    description: { type: String },
    set: { type: String },
    synonyms: { type: String },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'users',
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
})

const CardModel = model<ICard>('card', cardSchema)

export default CardModel