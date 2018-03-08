const _ = require('lodash');
import sanitize from 'mongo-sanitize';
import InternalError from './../context/internal.error.context';
import BusinessError from './../context/business.error.context';
import BadRequestError from './../context/badrequest.error.context';
import GenericError from './../context/generic.error.context';

const EMPTY = "";
const INTERNAL_ERROR = "internal_error";
const SPLIT_COMMA = ",";
const SPLIT_COLON = ":";
const STRING_SEARCH_FLAG = "i";
const INVALID_SEARCH_QUERY = "invalid_search_query";
const REQUIRED = "required";
const UNIQUE =  "unique";
const MONGOOSE_UNIQUE = "mongoose_unique";
const MONGOOSE_REQUIRED = "mongoose_required";
const MONGOOSE_BUSINESS_ERROR = "mongoose_business_error";

class BaseRepository {

    cleanData(data) {
        return sanitize(data);
    }

    convertToJson(data) {

        return JSON.parse(JSON.stringify(data));
    }

    translateDatabaseErrors(dbErrors) {
        const errors = []
        if(!dbErrors) {
            errors.push(new InternalError(INTERNAL_ERROR));
            return errors;
        }        
        else if (dbErrors instanceof GenericError){
            errors.push(dbErrors);
            return errors;
        } else {
            if(!dbErrors.errors) {
                errors.push(new InternalError(INTERNAL_ERROR));
                return errors;
            }

            _.forIn(dbErrors.errors, (error) => {    
                errors.push(parseErrorTranslate(error))
            })
        }

        return errors;
    }

    createQuery(page, perpage, populate, select) {
        var object = {};

        if(page) {
            object.page = this.cleanData(page);
        }

        if(perpage) {
            object.limit = this.cleanData(perpage);
        }

        if(populate){
            object.populate = populate
        }

        if(select) {
            object.select = this.cleanData(select);
        }

        return object;
    }

    createSearch (search){
        if(!search) {
            return EMPTY;
        }

        var response = {};
        search = this.cleanData(search);
        const arr = search.split(SPLIT_COMMA);
        arr.forEach(element => {
            const v = element.split(SPLIT_COLON);
            const key = v[0] || EMPTY;
            const value = v[1] || EMPTY;
            
            if(!key || !value) {
                throw new BadRequestError(INVALID_SEARCH_QUERY);
            }
            response[key] = { $regex:value, $options: STRING_SEARCH_FLAG};
        });

        return response;
        
    }
}

function parseErrorTranslate(error){

    if(!error || !error.kind) {
        return new InternalError(INTERNAL_ERROR);
    }

    switch (error.kind) {
        case UNIQUE:{
            
            const field = error.properties.path;
            return new BusinessError(MONGOOSE_UNIQUE, field);
        }
        case REQUIRED: {

            const field = error.properties.path;
            return new BusinessError(MONGOOSE_REQUIRED, field);
        }
        default:{

            return new BusinessError(MONGOOSE_BUSINESS_ERROR);
        }
    }
}

export default BaseRepository;