import * as express from 'express';
import ioc from './../../../../ioc';
import authMiddleware from './../../../../middlewares/auth.middleware';

const controller = ioc.getAuthControllerV1();
const BODY = "BODY";

export default express
  .Router()
    .post('/signup', controller.signup.bind(controller))
    .post('/login', controller.login.bind(controller))    
    .get('/check', controller.checkToken.bind(controller))
    .put('/update-password', authMiddleware, controller.updatePassword.bind(controller));
