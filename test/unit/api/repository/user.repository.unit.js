const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const sinon = require('sinon');
import { user1 } from '../../../stub/user.stub'
import UserModel from '../../../../server/api/repository/models/user.model';
import UserRepository from './../../../../server/api/repository/user.repository';
import {
    SuccessFakeUserModel, UniqueEmailFakeUserModel,
    RequiredPasswordFakeUserModel, UnexpectedMongooseValidationErrorFakeUserModel,
    UnexpectedErrorFakeUserModel
} from '../../../mock/user.mock'

module.exports = async function () {

    describe("Repository tests", function () {

        describe("Success repository tests", function () {

            it("should test add user", async function () {
                var userResponse = user1;
                userResponse._id = "5a470788f1ce805e7734f7a2";

                const userRepository = new UserRepository(SuccessFakeUserModel);
                await userRepository.create(user1);
            });

            it("should find all users", async function () {

                const responseExpected = {
                    "docs": [
                        {
                            "_id": "5a4585f8f3e446153194a4ec",
                            "firstname": "User test",
                            "lastname": "Tests",
                            "email": "test@example.com",
                            "photo": "string",
                            "description": "string",
                            "__v": 0,
                            "createdDate": "2017-12-29T00:01:54.000Z",
                            "permissions": [
                                "5a3ffc1d7b175f526c410097"
                            ]
                        },
                        {
                            "_id": "5a47bb1ab0ccf72fdd2f472d",
                            "firstname": "Ollon",
                            "lastname": "Jhonson",
                            "email": "ollon@example.com",
                            "photo": "string",
                            "description": "string",
                            "__v": 0,
                            "createdDate": "2017-12-30T16:12:31.000Z",
                            "permissions": [
                                "5a3ffc1d7b175f526c410097"
                            ]
                        }
                    ],
                    "total": 2,
                    "limit": 10,
                    "offset": 0,
                    "page": 1,
                    "pages": 1
                };

                const findAll = sinon.stub(UserModel, 'paginate');
                findAll.withArgs().returns(responseExpected);

                const userRepository = new UserRepository(UserModel);
                const users = await userRepository.findAll();

                expect(users).to.be.eql(responseExpected);
                findAll.restore();

            });

            it("should find by id", async function () {

                const responseExpected = {
                    "_id": "5a4585f8f3e446153194a4ec",
                    "firstname": "User test",
                    "lastname": "Tests",
                    "email": "test@example.com",
                    "photo": "string",
                    "description": "string",
                    "__v": 0,
                    "createdDate": "2017-12-29T00:01:54.000Z",
                    "permissions": [
                        "5a3ffc1d7b175f526c410097"
                    ]
                };

                const findOne = sinon.stub(UserModel, 'findOne');
                findOne.withArgs({ _id: responseExpected._id }).returns(responseExpected);

                const userRepository = new UserRepository(UserModel);
                const users = await userRepository.findById(responseExpected._id);

                expect(users).to.be.eql(responseExpected);
                findOne.restore();

            });


            it("should remove user", async function () {

                const responseExpected = {

                };

                const findOne = sinon.stub(UserModel, 'remove');
                findOne.withArgs({ _id: responseExpected._id }).returns(responseExpected);

                const userRepository = new UserRepository(UserModel);
                const users = await userRepository.delete(responseExpected._id);

                expect(users).to.be.eql(responseExpected);
                findOne.restore();

            });
        });

        describe("Error repository tests", function () {

            it("shouldn't add user with existent email", async function () {

                const expectedError = [{
                    code: 422,
                    field: "email",
                    message: "mongoose_unique"
                }];

                const userRepository = new UserRepository(UniqueEmailFakeUserModel);
                return expect(userRepository.create(user1))
                    .to.be.rejected
                    .and.to.eventually.deep.equal(expectedError);

            });

            it("shouldn't add user without password field", async function () {

                const expectedError = [{
                    code: 422,
                    field: "password",
                    message: "mongoose_required"
                }];

                const userRepository = new UserRepository(RequiredPasswordFakeUserModel);
                return expect(userRepository.create(user1))
                    .to.be.rejected
                    .and.to.eventually.deep.equal(expectedError);

            });

            it("shouldn't add user unexpected mongoose validation error", async function () {

                const expectedError = [{
                    code: 422,
                    field: undefined,
                    message: "mongoose_business_error"
                }];

                const userRepository = new UserRepository(UnexpectedMongooseValidationErrorFakeUserModel);
                return expect(userRepository.create(user1))
                    .to.be.rejected
                    .and.to.eventually.deep.equal(expectedError);

            });

            it("shouldn't add user unexpected error", async function () {

                const expectedError = [{
                    code: 500,
                    message: "internal_error"
                }];

                const userRepository = new UserRepository(UnexpectedErrorFakeUserModel);
                return expect(userRepository.create(user1))
                    .to.be.rejected
                    .and.to.eventually.deep.equal(expectedError);

            });
        });
    });
}