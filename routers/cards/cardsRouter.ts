import Router from 'express';
import { createCard, updateCard, deleteCard, listCard } from '../../controllers/cards/cardsController'
import { validationCard } from '../../middlewares/validationCard';
import guard from '../../middlewares/guard';

const router = Router();

router.post('/create', guard, validationCard, createCard)
router.put('/update/:id', guard, validationCard, updateCard)
router.delete('/delete/:id', guard, deleteCard)
router.get('/list', guard, listCard)


export default router