const errors = require('express-api-error-handler');
import {userApiV1} from './api/controllers/user';
import {authApiV1} from './api/controllers/auth';

export default function routes(app) {
  app.use('/api/v1/users', userApiV1);
  app.use('/api/v1/auth', authApiV1);
  app.use(errors.errorHandler({}));
  app.use(errors.notFoundHandler({}));
}
