import l from '../../common/logger';
import Q from 'q'

import PasswordUtils from './../util/password.utils'

import  NotFoundError from './../context/notfound.error.context';
import  InternalError from './../context/internal.error.context';
import  BadRequest from './../context/badrequest.error.context';

const INTERNAL_ERROR = "internal_error";
const USER_NOTFOUND = "user_notfound";
const BODY_NEEDED = "body_needed";
const USER_PERMISSON = "user_permission";

class UserService {

  constructor(userRepository, permissionRepository) {
    this.userRepository = userRepository;
    this.permissionRepository = permissionRepository;
  }

  async findAll(page, perpage, search) {
    try {
      return await this.userRepository.findAll(page, perpage, search);
    }catch(e){
      throw e;
    }
  }

  async findById(userId, select) {
    try{
      var user = {};
      if(select) {
        user = await this.userRepository.findById(userId, select);
      } else {
        user = await this.userRepository.findById(userId);
      }

      if(!user) {
        throw new NotFoundError(USER_NOTFOUND);
      }
      return user;
    }catch(e){
      throw e;
    }
  }

  async findUserByEmail(email) {
    try{
      const user = await this.userRepository.findUserByEmail(email);
      if(!user) {
        throw new NotFoundError(USER_NOTFOUND);
      }
      return user;
    }catch(e){
      throw e;
    }
  }

  async create(body) {
    try {      
      const permission = await this.permissionRepository.findByName(USER_PERMISSON);
      if (!permission) {
      
        throw new InternalError(INTERNAL_ERROR);
      }

      body.password = await PasswordUtils.generateHash(body.password);
      body.permissions = [permission._id];
      
      return await this.userRepository.create(body);
    }catch(e){

      throw e;
    }
  }

  async update(userId, body) {
    try{  

      if(!body) {
        throw new BadRequest(BODY_NEEDED);
      }

      var user = await this.userRepository.findById(userId, {password: 1});
      
      if(!user) {
        throw new NotFoundError(USER_NOTFOUND);
      }

      if(body.firstname) {
        user.firstname = body.firstname;
      }

      if(body.lastname) {
        user.lastname = body.lastname;
      }

      if(body.photo) {
        user.photo = body.photo;
      }

      if(body.password) {
        user.password = await PasswordUtils.generateHash(body.password);
      }

      if(body.description) {
        user.description = body.description;
      }

      if(body.isExternalAuth) {
        user.isExternalAuth = body.isExternalAuth;
      }

      return await this.userRepository.update(user);
    }catch(e){

      throw e;
    }
  }

  async delete(userId) {
    try{
      var user = await this.userRepository.findById(userId);
      if(!user) {
        throw new NotFoundError(USER_NOTFOUND);
      }
      
      return await this.userRepository.delete(userId);
    }catch(e){
      throw e;
    }
  }
}

export default UserService;
