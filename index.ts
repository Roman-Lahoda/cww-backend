import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import helmet from 'helmet'
import cors from 'cors'
import { httpCode } from './constants/httpCode'
import authRouter from './routers/auth/authRouters'
import cardsRouter from './routers/cards/cardsRouter'

const app: Express = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: 5000 }))

app.use('/user', authRouter)
app.use('/cards', cardsRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/google-login', (req: Request, res: Response) => {
    res.send('Google login if success');
});


app.use((_req: Request, res: Response) => {
    res.status(httpCode.NOT_FOUND)
        .json({ status: 'error', code: httpCode.NOT_FOUND, message: 'Not found' });
})

async function startApp() {
    try {
        await mongoose.connect(`${process.env.DB_URL}`);

        app.listen(process.env.PORT, () =>
            console.log('Server is running on PORT ' + process.env.PORT),
        );
    } catch (err) {
        console.log('err : ', err);
    }
}

startApp();

