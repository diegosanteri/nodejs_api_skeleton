import GenericError from './generic.error.context';

class BadRequestError extends GenericError{
    constructor(message){
        super();
        this.code = 400;
        this.message = message;
    }
}

export default BadRequestError;