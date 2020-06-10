import { Request, Response } from 'express';
import knex from '../database/connection';

import cfg from '../../config';

class PointsController {
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not Found' });
        }

        const itens = await knex('itens')
            .join('point-itens', 'itens.id', '=', 'point-itens.item_id')
            .where('point-itens.point_id', id)
            .select('itens.title');

        const serializedPoint = {
            ...point,
            image_url: `http://${cfg.ip}/uploads/${point.image}`
        };

        return response.json({ point: serializedPoint, itens });
    };

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            longitude,
            latitude,
            city,
            uf,
            itens
        } = request.body;

        //Validação do banco, se um falhar, falha todos
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            longitude,
            latitude,
            city,
            uf,
        };

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItens = itens
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: Number) => {
                return {
                    item_id,
                    point_id
                };
            });

        await trx('point-itens').insert(pointItens);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point
        });
    };

    async index(request: Request, response: Response) {
        const { city, uf, itens } = request.query;

        const parsedItens = String(itens).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point-itens', 'points.id', '=', 'point-itens.point_id')
            .whereIn('point-itens.item_id', parsedItens)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://${cfg.ip}/uploads/${point.image}`
            }
        });

        return response.json(serializedPoints);
    };
}

export default PointsController;