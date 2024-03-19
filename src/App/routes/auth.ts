import express, {Request, Response} from 'express';
import { insertUser, loginUser } from '../controllers/userControllers'

const router = express()

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, cpf, password, passwordConf } = req.body;
        const user = await insertUser(name, email, cpf, password, passwordConf)
        req.session.userID = user.id
        res.status(200).send('Sucesso')
    } catch (error) {
        res.json(error)
    }
}) 

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password)
        req.session.userID = user.id
        res.status(200).send('Sucesso')
    } catch (error) {
        res.json(error)
    }
})

router.get('/logout', (req: Request, res: Response) => {
    req.session.userID = undefined
    res.status(200).send('Sucesso')
})

export default router;