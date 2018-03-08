import l from '../../common/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import PasswordUtils from './../util/password.utils';

import NotFoundError from './../context/notfound.error.context';
import InternalError from './../context/internal.error.context';
import BadRequest from './../context/badrequest.error.context';
import Unauthorized from './../context/unauthorized.error.context';
import ForbiddenError from './../context/forbidden.error.context';

const INVALID_THIRD_PARTY_LOGIN = "invalid_third_party_login";
const INVALID_LOGIN_SERVICE = "invalid_login_service";
const JWT_EXPIRED = "jwt expired";
const EXPIRED_JWT_TOKEN = "expired_jwt_token";
const INVALID_JWT_TOKEN = "invalid_jwt_token";
const GOOGLE_SERVICE = "google";
const FACEBOOK_SERVICE = "facebook";
const PERMISSION_DENIED = 'permission_denied';
const MISSING_TOKEN = 'missing_token';

class AuthService {

    constructor(userService) {
        this.userService = userService;
    }

    async updatePassword(body) {

        try {
            const user = await this.userService.findById(body.userId, {password: 1});
            await PasswordUtils.comparePassword(body.oldPassword, user.password);
            user.password = body.newPassword;
            user.isExternalAuth = true;

            await this.userService.update(user._id, user);

        } catch (e) {

            throw e;
        }
    }

    async login(body) {
        try {

            const user = await this.userService.findUserByEmail(body.email);
            await PasswordUtils.comparePassword(body.password, user.password);

            return await this.generateToken(user);
        } catch (e) {
            
            throw e;
        }
    }

    async checkId(user, id) {

        if(!user || !id) {
            throw new Unauthorized(MISSING_TOKEN);
        } else if(user.id != id) {        
            throw new ForbiddenError (PERMISSION_DENIED);
        } 
    }

    async verifyToken(token) {
        try {

            return await jwt.verify(token, process.env.AUTH_SECRET);
        } catch (error) {

            switch (error.message) {
                case JWT_EXPIRED: {
                    throw new Unauthorized(EXPIRED_JWT_TOKEN);
                    break;
                }
                default:
                    throw new Unauthorized(INVALID_JWT_TOKEN);
            }
        }
    }

    generateToken(body) {
        var data = {
            id: body._id,
            email: body.email,
            permission: body.permissions
        }

        const token = jwt.sign({
            data
        }, process.env.AUTH_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_DAY });

        return { token };
    }
}

async function userExists(userService, email) {
    try {

        await userService.findUserByEmail(email);
        return true;
    } catch (e) {

        if (e instanceof NotFoundError) {
            return false;
        }

        throw e;
    }
}

export default AuthService;
