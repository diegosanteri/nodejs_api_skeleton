import GenericError from './generic.error.context';

class ForbiddenError extends GenericError{
    constructor(message){
        super();
        this.code = 403;
        this.message = message;
    }
}

export default ForbiddenError;