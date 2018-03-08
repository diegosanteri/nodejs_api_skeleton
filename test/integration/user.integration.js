const expect = require('chai').expect;
const request = require('supertest');
const userStub = require('./../stub/user.stub');
var authorizationToken = "";

module.exports = async function (server) {

    describe("User operations", function () {

        beforeEach(async () => {

            const login = {
                email: userStub.user3.email,
                password: userStub.user3.password
            };

            const res = await request(server)
                .post(`/api/v1/auth/login`)
                .send(login);
                
            authorizationToken = res.body.token;
        });

        describe("Operation success", function () {

            it("should list all users", async function () {
                const res = await request(server)
                    .get(`/api/v1/users`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(200);
                expect(res.body.total).to.equal(3);
                expect(res.body.limit).to.equal(10);
                expect(res.body.offset).to.equal(0);
                expect(res.body.page).to.equal(1);
                expect(res.body.pages).to.equal(1);
            });

            it("should delete user four", async function () {

                var res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(userStub.user4);

                const user = res.body;

                res = await request(server)
                    .post(`/api/v1/auth/login`)
                    .send({
                        email: userStub.user4.email,
                        password: userStub.user4.password
                    });

                const token = res.body.token;

                res = await request(server)
                    .delete(`/api/v1/users/${user._id}`)
                    .set('Authorization', token);
                
                expect(res.statusCode).to.equal(204);

                res = await request(server)
                    .get(`/api/v1/users/${user._id}`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(404);
            });

            it("should list all users per page", async function () {
                const res = await request(server)
                    .get(`/api/v1/users?_page=1`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(200);
                expect(res.body.total).to.equal(3);
                expect(res.body.limit).to.equal(10);
                expect(res.body.page).to.equal(1);
                expect(res.body.pages).to.equal(1);
            });

            it("should get user by token", async function () {
                const res = await request(server)
                    .get(`/api/v1/users/me`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(200);
            });

            it("should list users with page and limit", async function () {
                const res = await request(server)
                    .get(`/api/v1/users?_perpage=2&_page=1`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(200);
                expect(res.body.docs.length).to.equal(2);
                expect(res.body.page).to.equal(1);
                expect(res.body.pages).to.equal(2);
            });

            it("should list users search", async function () {
                const res = await request(server)
                    .get(`/api/v1/users?_search=email:ollon@example.com`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(200);
                expect(res.body.docs.length).to.equal(1);
            });

            it("should update user", async function () {

                var res = await request(server)
                    .get(`/api/v1/users?_search=firstname:${userStub.user1.firstname}`)
                    .set('Authorization', authorizationToken);
                
                var user = res.body.docs[0];
                user.firstname = "New name";

                res = await request(server)
                .post(`/api/v1/auth/login`)
                .send({
                    email: userStub.user1.email,
                    password: userStub.user1.password
                });

                const token = res.body.token;

                res = await request(server)
                    .put(`/api/v1/users/${user._id}`)
                    .set('Authorization', token)
                    .send(user);

                expect(res.statusCode).to.equal(204);

                res = await request(server)
                    .get(`/api/v1/users/${user._id}`)
                    .set('Authorization', token);


                expect(res.statusCode).to.equal(200);
                expect(res.body.firstname).to.equal(user.firstname);

            });
        });

        describe("Operation error", function () {

            it("shouldn't insert duplicate user", async function () {
                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .set('Authorization', authorizationToken)
                    .send(userStub.user2);

                expect(res.statusCode).to.equal(422);
            });

            it("shouldn't insert without email", async function () {
                const user = {
                    ...userStub.user1
                };

                delete (user.email);
                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(user);
                expect(res.statusCode).to.equal(400);
            });

            it("shouldn't insert without password", async function () {
                 const user = {
                    ...userStub.user1
                };
                delete (user.password);
                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(user);
                expect(res.statusCode).to.equal(400);
            });

            it("shouldn't insert with invalid email", async function () {
                var user = {
                    ...userStub.user1
                };
                user.email = "aaaaa.com";

                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(user);
                expect(res.statusCode).to.equal(400);
            });

            it("shouldn't insert with short firstname", async function () {
                var user = userStub.user1;
                user.firstname = "a";

                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(user);
                expect(res.statusCode).to.equal(400);
            });

            it("shouldn't list all users page wrong param", async function () {
                const res = await request(server)
                    .get(`/api/v1/users?_page=s`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(400);
            });

            it("shouldn't list all users per page wrong param", async function () {
                const res = await request(server)
                    .get(`/api/v1/users?_perpage=s`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(400);
            });

            it("shouldn't list all users search wrong param", async function () {
                const res = await request(server)
                    .get(`/api/v1/users?_search=fff`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(400);
            });

            it("shouldn't  call invalid url", async function () {

                const res = await request(server)
                    .delete(`/api/v1/users/invalid/abc`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(404);
            });

            it("shouldn't  call not available http status", async function () {

                const res = await request(server)
                    .patch(`/api/v1/users`)
                    .set('Authorization', authorizationToken);

                expect(res.statusCode).to.equal(405);
            });
        });
    });
};