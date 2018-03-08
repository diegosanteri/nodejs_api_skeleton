import l from '../../common/logger';
import Q from 'q'
import BaseRepository from './base.repository'
import InternalError from './../context/internal.error.context';

class RoleRepository extends BaseRepository {

    constructor(roleModel) {
        super();
        this.roleModel = roleModel;
    }

    async create(role) {
        try {
            const roleModel = new this.roleModel(role);
            return await roleModel.save();
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }
}

export default RoleRepository;
