import { Request, Response, Router } from "express";
// import {selectLastEntries, selectRandomSockets} from './query/getLastEntry';
import {generateRandomReadings} from './query/readings';

const deltaRouter: Router = Router();

deltaRouter.get('/readings', async (req: Request, res: Response) => {
  try {
    const req = await generateRandomReadings()
    res.send(req)
  } catch(err) {
    res.status(401)
    res.send(`Post handling error: - :post - ${err}`)
  }
})

export default deltaRouter
