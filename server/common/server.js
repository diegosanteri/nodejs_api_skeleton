import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import Database from './../common/database';
import initialize from './initialize';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import queryParams from 'express-query-params';
import allowCors from './cors';
import l from './logger';
import i18n from './i18n';

const app = new Express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));
    app.use(i18n);
    app.use(allowCors);
    app.use(queryParams({
        typeCast: true,
        parseNum: (a)=>{
            return parseFloat(a)
        }
    }));
    new Database();
    if (process.env.NODE_ENV != "test") {
      initialize();
    }
  }

  router(routes) {
    swaggerify(app, routes);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = p => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${p}}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
