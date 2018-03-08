import AuthControllerV1 from './../api/controllers/auth/v1/controller';
import UserControllerV1 from './../api/controllers/user/v1/controller';

import AuthService from './../api/services/auth.service';
import UserService from './../api/services/user.service';
import ApplicationService from './../api/services/application.service';

import UserRepository from './../api/repository/user.repository';
import ApplicationRepository from './../api/repository/application.repository';
import PermissionRepository from './../api/repository/permission.repository';
import RoleRepository from './../api/repository/role.repository';

import ApplicationModel from '../api/repository/models/application.model';
import UserModel from '../api/repository/models/user.model';
import PermissionModel from '../api/repository/models/permission.model';
import RoleModel from '../api/repository/models/role.model';

class InversionOfControl {

    constructor() {
        // repositories
        this.applicationRepository = new ApplicationRepository(ApplicationModel);
        this.permissionRepository = new PermissionRepository(PermissionModel);
        this.roleRepository = new RoleRepository(RoleModel);
        this.userRepository = new UserRepository(UserModel);
        
        //services
        this.applicationService = new ApplicationService(this.applicationRepository, 
            this.permissionRepository, this.roleRepository);   
        this.userService = new UserService(this.userRepository, this.permissionRepository);
        this.authService = new AuthService(this.userService);

        //controllers
        this.authController = new AuthControllerV1(this.userService, this.authService);
        this.userController = new UserControllerV1(this.userService);
    }

    getAuthControllerV1() {        
        return this.authController;

    }

    getUserControllerV1() {        
        return this.userController;
    }

    getApplicationService() {
        return this.applicationService;
    }

    getAuthService () {
        return this.authService;
    }

    getUserService () {
        return this.userService;
    }

    getUserRepository () {
        return this.userRepository;
    }

    getPermissionRepository () {
        return this.permissionRepository;
    }

    getRoleRepository () {
        return this.roleRepository;
    }
}

export default new InversionOfControl();

