import bcrypt from 'bcrypt';

import InternalError from './../context/internal.error.context';
import Unauthorized from './../context/unauthorized.error.context';

const INTERNAL_ERROR = "internal_error";
const INVALID_LOGIN = "invalid_login";
const BASE64_ENCODED = "base64";

class PasswordUtils {
    async generateHash(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch(e) {
            
            throw new InternalError(INTERNAL_ERROR);
        }
    }

    async comparePassword(password, hashPassword) {
        try {
            const matches = await bcrypt.compare(password, hashPassword);
            if (!matches) {
                throw new Unauthorized(INVALID_LOGIN);
            }
            return true;
        } catch(e) {
            throw e;
        }         
    }

    async genarateExternalPassword(email, serviceHash) {
        try {

            return new Buffer(email + serviceHash).toString(BASE64_ENCODED);
        } catch(e) {
            
            throw e;
        }         
    }
}

export default new PasswordUtils();