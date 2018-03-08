const PATH = "{PATH}";
const INTERNAL_ERROR = "internal_error";
const EMPTY = "";

class BaseController {
    
    async error(json, translate) {
        const body = {
            code: EMPTY,
            errors: []
        };
        
        if(json) {
            if(Array.isArray(json)) {
                json.forEach(element => {
                    body.code = element.code;
                    if(element.field) {
                        element.message = translate(element.message)
                                            .replace(PATH, element.field)
                    } else {
                        element.message = translate(element.message);
                    }
                    body.errors.push(element.message);
                });
            } 
            else {  
                body.code = json.code;
                body.errors.push(translate(json.message));
            }
        } else {
            body.code = 500;
            body.errors.push(translate(INTERNAL_ERROR));
        }

        return body;
    }
}

export default BaseController;