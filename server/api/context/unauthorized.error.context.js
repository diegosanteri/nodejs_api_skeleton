import GenericError from './generic.error.context';

class UnauthorizedError extends GenericError{
    constructor(message){
        super();
        this.code = 401;
        this.message = message;
    }
}

export default UnauthorizedError;