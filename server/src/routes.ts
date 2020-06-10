import express, { request, response } from 'express';
import multer from 'multer';

import PointsController from './controllers/PointsController';
import ItensController from './controllers/IntensController';
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);
const pointsController = new PointsController();
const itensController = new ItensController();

//index, show, create, update, delete ...

routes.get('/itens', itensController.index);
routes.post('/points', upload.single('image'), pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;