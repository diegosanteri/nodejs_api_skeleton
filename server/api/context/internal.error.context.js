import GenericError from './generic.error.context';

class InternalError extends GenericError{
    constructor(message){
        super();
        this.code = 500;
        this.message = message;
    }
}

export default InternalError;