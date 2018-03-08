import q from 'q';

const SuccessFakeUserModel = class FakeUserModel {
    constructor(body) {
        this.body = body
    }

    save() {
        return new q.Promise((resolve, reject) => {
            resolve(this.body);
        })
    }
}

const UniqueEmailFakeUserModel = class ErrorFakeUserModel {
    constructor(body) {
        this.body = body
    }

    save() {
        return new q.Promise((resolve, reject) => {
            reject({errors: [{
                kind: 'unique',
                properties: {
                    path: "email"
                }
            }]});
        })
    }
}

const RequiredPasswordFakeUserModel = class ErrorFakeUserModel {
    constructor(body) {
        this.body = body
    }

    save() {
        return new q.Promise((resolve, reject) => {
            reject({errors: [{
                kind: 'required',
                properties: {
                    path: "password"
                }
            }]});
        })
    }
}

const UnexpectedMongooseValidationErrorFakeUserModel = class ErrorFakeUserModel {
    constructor(body) {
        this.body = body
    }

    save() {
        return new q.Promise((resolve, reject) => {
            reject({errors: [{
                kind: 'anyother'
            }]});
        })
    }
}

const UnexpectedErrorFakeUserModel = class ErrorFakeUserModel {
    constructor(body) {
        this.body = body
    }

    save() {
        return new q.Promise((resolve, reject) => {
            reject({errors: null});
        })
    }
}


module.exports = {
    SuccessFakeUserModel,
    UniqueEmailFakeUserModel,
    RequiredPasswordFakeUserModel,
    UnexpectedErrorFakeUserModel,
    UnexpectedMongooseValidationErrorFakeUserModel
}