import GenericError from './generic.error.context';
class BusinessError extends GenericError{
    constructor(message, field){
        super();
        this.code = 422;
        this.message = message;
        this.field = field;
    }
}

export default BusinessError;