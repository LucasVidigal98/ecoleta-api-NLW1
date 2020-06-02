import express, { request, response } from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';

//Request param: Parâmetros da própria rota que identidicam um recurso
//Query Param: Parâmetros que vem na própria rota geralmente opicionais para filtros, paginações
//Request body: Parâmetros para criação/atualização de informações

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333);