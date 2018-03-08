import GenericError from './generic.error.context';

class NotFoundError extends GenericError {
    constructor(message){
        super();
        this.code = 404;
        this.message = message;
    }
}

export default NotFoundError;