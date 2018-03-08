const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const sinon = require('sinon');
import { user1 } from '../../../stub/user.stub';
import UserService from './../../../../server/api/services/user.service';
import UserRepository from './../../../../server/api/repository/user.repository';
import PermissionRepository from './../../../../server/api/repository/permission.repository';

module.exports = async function () {

    var createUser;
    var updateUser;
    var findUserById;
    var findPermissionByName;
    var findAllUsers;
    var deleteUser;

    describe("Service tests", function () {

        beforeEach((done) => {
            createUser = sinon.stub(UserRepository.prototype, 'create');
            updateUser = sinon.stub(UserRepository.prototype, 'update');
            findUserById = sinon.stub(UserRepository.prototype, 'findById');
            findAllUsers = sinon.stub(UserRepository.prototype, 'findAll');
            findPermissionByName = sinon.stub(PermissionRepository.prototype, 'findByName');
            deleteUser = sinon.stub(UserRepository.prototype, 'delete');

            done();
        });

        afterEach((done) => {
            findPermissionByName.restore();
            findUserById.restore();
            createUser.restore();
            updateUser.restore();
            findAllUsers.restore();
            deleteUser.restore();

            done();
        });

        describe("Success Service tests", function () {

            it("should test add user", async function () {

                const permissionResponse = {
                    _id: "5a3ffc1d7b175f526c410097"
                };

                const userResponse = {
                    "_id": "5a4585f8f3e446153194a4ec",
                    "firstname": "User test",
                    "lastname": "Tests",
                    "email": "test@example.com",
                    "password": "string",
                    "photo": "string",
                    "description": "string",
                    "__v": 0,
                    "createdDate": "2017-12-29T00:01:54.000Z",
                    "permissions": [
                        "5a3ffc1d7b175f526c410097"
                    ]
                };

                findPermissionByName.withArgs("user_permission").returns(permissionResponse);
                createUser.withArgs(user1).returns(userResponse);

                const userService = new UserService(new UserRepository(), new PermissionRepository());
                const response = await userService.create(user1);
            })

            it("should update user", async function () {

                const userResponse = {
                    "_id": "5a4585f8f3e446153194a4ec",
                    "firstname": "User test",
                    "lastname": "Tests",
                    "email": "test@example.com",
                    "password": "string",
                    "photo": "string",
                    "description": "string",
                    "__v": 0,
                    "createdDate": "2017-12-29T00:01:54.000Z",
                    "permissions": [
                        "5a3ffc1d7b175f526c410097"
                    ]
                };

                findUserById.withArgs("5a4585f8f3e446153194a4ec").returns(userResponse);
                updateUser.withArgs(userResponse).returns({});

                const userService = new UserService(new UserRepository(), new PermissionRepository());
                const response = await userService.update("5a4585f8f3e446153194a4ec", userResponse);

            });

            it("should find all users", async function () {


                const userResponse = [{
                    "_id": "5a4585f8f3e446153194a4ec",
                    "firstname": "User test",
                    "lastname": "Tests",
                    "email": "test@example.com",
                    "password": "string",
                    "photo": "string",
                    "description": "string",
                    "__v": 0,
                    "createdDate": "2017-12-29T00:01:54.000Z",
                    "permissions": [
                        "5a3ffc1d7b175f526c410097"
                    ]
                }];

                findAllUsers.withArgs("", "", "").returns(userResponse);

                const userService = new UserService(new UserRepository(), new PermissionRepository());
                const response = await userService.findAll("", "", "");

                findAllUsers.restore();
            });

            it("should find by id", async function () {

                const userResponse = {
                    "_id": "5a4585f8f3e446153194a4ec",
                    "firstname": "User test",
                    "lastname": "Tests",
                    "email": "test@example.com",
                    "password": "string",
                    "photo": "string",
                    "description": "string",
                    "__v": 0,
                    "createdDate": "2017-12-29T00:01:54.000Z",
                    "permissions": [
                        "5a3ffc1d7b175f526c410097"
                    ]
                };

                findUserById.withArgs("5a4585f8f3e446153194a4ec").returns(userResponse);

                const userService = new UserService(new UserRepository(), new PermissionRepository());
                const response = await userService.findById("5a4585f8f3e446153194a4ec");
            });

            it("should remove user", async function () {

                const userResponse = {
                    "_id": "5a4585f8f3e446153194a4ec",
                    "firstname": "User test",
                    "lastname": "Tests",
                    "email": "test@example.com",
                    "password": "string",
                    "photo": "string",
                    "description": "string",
                    "__v": 0,
                    "createdDate": "2017-12-29T00:01:54.000Z",
                    "permissions": [
                        "5a3ffc1d7b175f526c410097"
                    ]
                };

                findUserById.withArgs("5a4585f8f3e446153194a4ec").returns(userResponse);
                deleteUser.withArgs("5a4585f8f3e446153194a4ec").returns({});

                const userService = new UserService(new UserRepository(), new PermissionRepository());
                const response = await userService.delete("5a4585f8f3e446153194a4ec");
            });
        });

        describe("Error Service tests", function () {

            it("shouldn't add user with existent email", async function () {
                const permissionResponse = {
                    _id: "5a3ffc1d7b175f526c410097"
                };

                const expectedError = [{
                    code: 422,
                    field: "email",
                    message: "mongoose_unique"
                }];

                findPermissionByName.withArgs("user_permission").returns(permissionResponse);
                createUser.withArgs(user1).throws(expectedError);

                const userService = new UserService(new UserRepository(), new PermissionRepository());

                return expect(userService.create(user1))
                    .to.be.rejected.and.to.eventually.deep.equal(expectedError);
            });

            it("shouldn't add user without password field", async function () {
                const permissionResponse = {
                    _id: "5a3ffc1d7b175f526c410097"
                };

                const expectedError = [{
                    code: 422,
                    field: "password",
                    message: "mongoose_required"
                }];

                findPermissionByName.withArgs("user_permission").returns(permissionResponse);
                createUser.withArgs(user1).throws(expectedError);

                const userService = new UserService(new UserRepository(), new PermissionRepository());

                return expect(userService.create(user1))
                    .to.be.rejected.and.to.eventually.deep.equal(expectedError);
            });
        });
    });
}