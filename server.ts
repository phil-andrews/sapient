require('dotenv').config()
console.log(new Date())
import * as express from 'express';
import { Application } from 'express';
const bodyParser = require('body-parser')
const cors = require('cors')
import deltaRouter from './routes/delta/routes';
import {startPoll} from './service/meter/poll';


const app: Application = express();
app.use(cors())
app.use(bodyParser.json({type: 'application/json'}));

app.use('/meter', deltaRouter)

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.info(`App listening on port ${port}!`);
});


startPoll()
