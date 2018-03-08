const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

import AuthService from './../../../../server/api/services/auth.service'
import UserService from './../../../../server/api/services/user.service'

const sinon = require('sinon');

module.exports = async function () {
    var createUserService;
    var findUserByEmail;


    describe("Service tests", function () {
        beforeEach((done) => {
            createUserService = sinon.stub(UserService.prototype, 'create');
            findUserByEmail = sinon.stub(UserService.prototype, 'findUserByEmail');

            done();
        });

        afterEach((done) => {
            createUserService.restore();
            findUserByEmail.restore();

            done();
        });

        it("should do login", async function () {
            const authService = new AuthService(new UserService());
            const userRequest = {
                email: 'ollon@example.com',
                password: 'string'
            }
            const userResponse = {
                "_id": "5a5136a6bf7345055123891c",
                "firstname": "Ollon",
                "lastname": "Jhonson",
                "email": "ollon@example.com",
                "password": "$2a$10$ZCmqJGQO7kIpoJ5SRboae.wxcZp6cKaBF2PC5CgWwZ3xcE0MkIjIW",
                "photo": "string",
                "description": "string",
                "createdDate": "2018-01-06T20:50:39Z",
                "permissions": [
                    "5a5111d988c87c50b894072c"
                ]
            }

            findUserByEmail.withArgs("ollon@example.com").returns(userResponse);
            const loginResponse = await authService.login(userRequest);
            
            expect(loginResponse.token).not.equal(undefined);
        });
    })
}