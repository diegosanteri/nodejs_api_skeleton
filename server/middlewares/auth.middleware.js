import ioc from './../ioc';
const authService = ioc.getAuthService();
const OPTIONS = 'OPTIONS';
const AUTHORIZATION_HEADER = 'authorization';
const MISSING_TOKEN = 'missing_token';

export default async (req, res, next) => {

    if(req.method === OPTIONS) {
        next()
    } else {
        const token = req.headers[AUTHORIZATION_HEADER]
        if(!token) {
            return res.status(401).send({errors: [res.translate(MISSING_TOKEN)]})
        }

        try {
            req.decoded = await authService.verifyToken(token);
            next();
        }catch(e) {
            const response = {errors: []};
            response.errors.push(res.translate(e.message));
            res.status(e.code).send(response);
        }
    }
}