const expect = require('chai').expect;
const request = require('supertest');
const userStub = require('./../stub/user.stub');

module.exports = async function (server) {

    describe("Auth operations", function () {

        describe("Operation success", function () {
            it("should insert user one", async function () {
                const body = userStub.user1;
                body.password = "12345678";

                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(body);

                expect(res.statusCode).to.equal(201);
                expect(res.body._id).not.equal(undefined);
                expect(res.body.firstname, userStub.user1.firstname);
                expect(res.body.lastname, userStub.user1.lastname);
                expect(res.body.email, userStub.user1.email);
                expect(res.body.photo, userStub.user1.photo);
                expect(res.body.description, userStub.user1.description);
            });

            it("should insert user two", async function () {
                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(userStub.user2);

                expect(res.statusCode).to.equal(201);
                expect(res.body._id).not.equal(undefined);
                expect(res.body.firstname, userStub.user2.firstname);
                expect(res.body.lastname, userStub.user2.lastname);
                expect(res.body.email, userStub.user2.email);
                expect(res.body.photo, userStub.user2.photo);
                expect(res.body.description, userStub.user2.description);
            });

            it("should insert user three", async function () {
                const res = await request(server)
                    .post(`/api/v1/auth/signup`)
                    .send(userStub.user3);

                expect(res.statusCode).to.equal(201);
                expect(res.body._id).not.equal(undefined);
                expect(res.body.firstname, userStub.user3.firstname);
                expect(res.body.lastname, userStub.user3.lastname);
                expect(res.body.email, userStub.user3.emaUserModelil);
                expect(res.body.photo, userStub.user3.photo);
                expect(res.body.description, userStub.user3.description);
            });

            it("should login in system", async function () {
                const user = {
                    email: userStub.user3.email,
                    password: userStub.user3.password
                }
                const res = await request(server)
                    .post(`/api/v1/auth/login`)
                    .send(user);

                expect(res.statusCode).to.equal(200);
                expect(res.body.token).not.equal(null);
            });

            it("should check a valid token", async function () {
                const user = {
                    email: userStub.user3.email,
                    password: userStub.user3.password
                }
                var res = await request(server)
                    .post(`/api/v1/auth/login`)
                    .send(user);

                expect(res.statusCode).to.equal(200);
                expect(res.body.token).not.equal(null);

                const authorizationToken = res.body.token;
                res = await request(server)
                    .get(`/api/v1/auth/check`)
                    .set('Authorization', authorizationToken)
                    .send();

                expect(res.statusCode).to.equal(204);
            });
        })

        describe("Operation error", function () {

            it("shouldn't login in system", async function () {
                const user = {
                    email: userStub.user3.email,
                    password: "invalidpass"
                }
                const res = await request(server)
                    .post(`/api/v1/auth/login`)
                    .send(user);
                
                expect(res.statusCode).to.equal(401);
            });

            it("shouldn't check an invalid token", async function () {

                var res = await request(server)
                    .get(`/api/v1/auth/check`)
                    .set('Authorization', "adddveeervwerrh")
                    .send();

                expect(res.statusCode).to.equal(401);
            });
        })
    })
}