import {sprintf} from 'sprintf-js';
import BaseController from '../../base.controller';

const USER_LOCATION_URL = "/v1/users/%s"
const AUTHORIZATION_HEADER = "authorization";

class Controller extends BaseController {

  constructor(userService, authService) {
    super();
    this.userService = userService;
    this.authService = authService;
  }

  async signup(req, res) {
    try {
      const user = await this.userService.create(req.body);

      res
        .location(sprintf(USER_LOCATION_URL, user._id))
        .status(201)
        .json(user);
    } catch (e) {
      const error = await this.error(e, res.translate);
      res
        .status(error.code)
        .json(error)
    }
  }

  async login(req, res) {

    try {
      const successLogin = await this.authService.login(req.body);
      res
        .status(200)
        .json(successLogin);
    } catch (e) {
      const error = await this.error(e, res.translate);
      res
        .status(error.code)
        .json(error)
    }
  }

  async updatePassword(req, res) {
    try {
      req.body.userId = req.decoded.data.id;
      await this.authService.updatePassword(req.body);
      
      res
        .status(204)
        .json({});
    } catch (e) {
      const error = await this.error(e, res.translate);
      res
        .status(error.code)
        .json(error)
    }
  }

  async checkToken(req, res) {
    try {

      const token = req.headers[AUTHORIZATION_HEADER];
      const decodedData = await this.authService.verifyToken(token);
      res
        .status(204)
        .json({});
    } catch (e) {

      const error = await this.error(e, res.translate);
      res
        .status(error.code)
        .json(error)
    }

  }
}
export default Controller;
