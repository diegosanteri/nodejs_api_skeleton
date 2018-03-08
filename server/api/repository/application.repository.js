import l from '../../common/logger';
import Q from 'q';
import BaseRepository from './base.repository';
import { appendFile } from 'fs';

class ApplicationRepository extends BaseRepository {

    constructor(applicationModel) {
        super();
        this.applicationModel = applicationModel;
    }

    async create() {
        try {
            const application = new this.applicationModel({isStarted: true});
            return await application.save();
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }

    async find() {
        try {
            const application = await this.applicationModel.find({});
            return application;
        } catch (e) {
            throw this.translateDatabaseErrors(e);
        }
    }
}

export default ApplicationRepository;
