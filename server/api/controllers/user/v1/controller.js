import BaseController from '../../base.controller';
var userService = {};

class Controller extends BaseController {

  constructor (userService) {
    super();
    super.userService = userService;
  }

  async findAll(req, res) {
    try {
      const users = await this.userService.findAll(req.query._page, req.query._perpage,
        req.query._search);

      res
        .status(200)
        .json(users);
    } catch (e) {
      const error = await this.error(e, res.translate);
      res
        .status(error.code)
        .json(error)
    }
  }

  async byToken(req, res) {
    var decoded = req.decoded;

    try {
      var id = decoded.data.id;
      const user = await this.userService.findById(id);
      res
        .status(200)
        .json(user);
    } catch (e) {
      const error = await this.error(e, res.translate);
      res
        .status(error.code)
        .json(error)
    }
  }

  async findById(req, res) {
    try {
      const user = await this.userService.findById(req.params.userId);
      res
        .status(200)
        .json(user);
    } catch (e) {
      const error = await this.error(e, res.translate);
      res
        .status(error.code)
        .json(error)
    }
  }
  
  async update(req, res) {
    try {
      const user = await this.userService.update(req.decoded.data.id, req.body);
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

  async delete(req, res) {
    try {
      await this.userService.delete(req.decoded.data.id);
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
export default Controller
