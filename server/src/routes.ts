import express, { request, response } from 'express';

import PointsController from './controllers/PointsController';
import ItensController from './controllers/IntensController';

const routes = express.Router();
const pointsController = new PointsController();
const itensController = new ItensController();

//index, show, create, update, delete ...

routes.get('/itens', itensController.index);
routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;