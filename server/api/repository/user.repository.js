import l from '../../common/logger';
import Q from 'q'
import BaseRepository from './base.repository'
import InternalError from './../context/internal.error.context';

class UserRepository extends BaseRepository {

    constructor(userModel) {
        super();
        this.userModel = userModel;
    }

    async findAll(page, perpage, search) {
        try {

            const searchObject = this.createSearch(search);
            const query = this.createQuery(page, perpage, null, {password: 0, __v: 0, isExternalAuth: 0});
            
            return await this.userModel.paginate(searchObject, query);
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }

    async findById(id, select) {
        const cleanId = this.cleanData(id);
        const selectField = select ? select : {password: 0, __v: 0, isExternalAuth: 0};

        try {
            return await this.userModel.findOne({ _id: cleanId }, selectField);
        } catch (e) {

            throw this.translateDatabaseErrors(e);
        }
    }

    async findUserByEmail(email) {
        const cleanEmail = this.cleanData(email);
        try {
            return await this.userModel.findOne({ email: cleanEmail });
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }

    async create(body) {
        try {
            const cleanBody = this.cleanData(body);
            const userInstance = new this.userModel(cleanBody);
            var newUser =  await userInstance.save();
            newUser.password = undefined;
            newUser.__v = undefined;
            newUser.isExternalAuth = undefined;

            return newUser;
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }

    async update(body) {
        try {          
            
            body.firstname = this.cleanData(body.firstname);
            body.lastname = this.cleanData(body.lastname);
            body.photo = this.cleanData(body.photo);
            body.description = this.cleanData(body.description);        

            return await body.save();
        } catch (e) {

            throw this.translateDatabaseErrors(e);
        }
    }

    async delete(id) {
        try {
            const cleanId = this.cleanData(id);
            return await this.userModel.remove({ _id: cleanId });
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }
}

export default UserRepository
