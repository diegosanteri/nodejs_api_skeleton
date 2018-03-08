import ioc from './../server/ioc'
import server from './../server/index';
const authIntegration = require("./integration/auth.integration");
const userIntegration = require("./integration/user.integration");
const authServiceUnit = require('./unit/api/service/auth.service.unit');
const userServiceUnit = require('./unit/api/service/user.service.unit');
const application = ioc.getApplicationService();

describe("Unit Tests", function () {

    it("should test all users operations", async function () {
        await authServiceUnit();
        await userServiceUnit();
    });
});

describe("Integration Tests", function () {

    it("should test all users operations", async function () {

        await application.initApplication();
        await authIntegration(server);
        await userIntegration(server);
    });
});
