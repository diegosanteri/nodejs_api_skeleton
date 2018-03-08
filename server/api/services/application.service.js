import l from '../../common/logger';
import Q from 'q'
import fs from "fs";

import internalError from './../context/internal.error.context';
import appRoot from 'app-root-path';

const INITIAL_DATA_PATH = appRoot + '/server/common/data.json';
const CHARSET = "utf-8";
const ADMIN_FLAG_PERMISSION = "admin.";

class ApplicationService {

    constructor(applicationRepository, permissionRepository, roleRepository) {
        this.applicationRepository = applicationRepository;
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    async initApplication() {
        try {
            const application = await this.applicationRepository.find();
            if (application.length > 0) {
                return;
            }

            const data = fs.readFileSync(INITIAL_DATA_PATH, CHARSET);
            var json = JSON.parse(data);
            const userRoles = [];
            const adminRoles = [];

            for (var i = 0; i < json.roles.length; i++) {
                const role = await this.roleRepository.create(json.roles[i]);
                if (role.name.startsWith(ADMIN_FLAG_PERMISSION)) {
                    adminRoles.push(role._id);
                } else {
                    userRoles.push(role._id);
                }
            }

            const userPermission = json.permissions[0];
            const adminPermission = json.permissions[1];

            userPermission.roles = userRoles;
            adminPermission.roles = adminRoles;

            await this.permissionRepository.create(userPermission);
            await this.permissionRepository.create(adminPermission);
            await this.applicationRepository.create();

        } catch (e) {
            console.log(e)
        }
    }
}

export default ApplicationService;
