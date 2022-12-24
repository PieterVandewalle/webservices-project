const axios = require('axios');
const config = require('config');
const supertest = require('supertest');
const { initializeLogger } = require('../src/core/logging');

const createServer = require('../src/createServer');
const { getPrisma } = require('../src/data');

const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
const NODE_ENV = config.get('env');


const fetchAccessToken = async (username, password) => {
  const response = await axios.post(config.get('auth.tokenUrl'), {
    grant_type: 'password',
    username: username,
    password: password,
    audience: config.get('auth.audience'),
    scope: 'openid profile email offline_access',
    client_id: config.get('auth.clientId'),
    client_secret: config.get('auth.clientSecret'),
  },
  {
    headers: {
      'accept-encoding' : '*'
    }
  });

  return response.data.access_token;
};

/**
 * Ensure a server instance is running.
 *
 * @param {Function} setter - Setter which gives access to the supertest agent and the Prisma instance
 *
 * @returns {supertest.SuperAgentTest} A supertest agent.
 */
const withServer = (setter) => {
  let server;
  beforeAll(async () => {
    server = await createServer();
    const userToken = await fetchAccessToken(config.get(`auth.testUser.username`), config.get(`auth.testUser.password`));
    const adminToken = await fetchAccessToken(config.get(`auth.testUserAdmin.username`), config.get(`auth.testUserAdmin.password`));
    setter({
      prisma: getPrisma(),
      request: supertest(server.getApp().callback()),
      authHeaderUser: `Bearer ${userToken}`,
      authHeaderAdmin: `Bearer ${adminToken}`,
    });
  });

  afterAll(async () => {
    // Cleanup resources!
    await server.stop();
  });
};

const initializeLoggerInUnitTests = () => {
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: {
      NODE_ENV,
    },
  });
}

module.exports = {
  fetchAccessToken,
  withServer,
  initializeLoggerInUnitTests
};