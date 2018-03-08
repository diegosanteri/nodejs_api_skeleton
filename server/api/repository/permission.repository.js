import l from '../../common/logger';
import Q from 'q'
import BaseRepository from './base.repository'
import InternalError from './../context/internal.error.context';

class PermissionRepository extends BaseRepository {

    constructor(permissionModel) {
        super();
        this.permissionModel = permissionModel;
    }

    async findByName(name) {
        try {
            return await this.permissionModel.findOne({name: name})
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }

    async create(permission) {
        try {
            const permissionInstace = new this.permissionModel(permission);
            return await permissionInstace.save();
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }
}

export default PermissionRepository;
