import * as express from 'express';
import authMiddleware from './../../../../middlewares/auth.middleware';
import ioc from './../../../../ioc';

const PARAM = "PARAM";

const controller = ioc.getUserControllerV1();

export default express
  .Router()
    .get('/', authMiddleware, controller.findAll.bind(controller))
    .get('/me', authMiddleware, controller.byToken.bind(controller))
    .get('/:userId', authMiddleware, controller.findById.bind(controller))
    .put('/:userId', authMiddleware, controller.update.bind(controller))
    .delete('/:userId', authMiddleware, controller.delete.bind(controller));
