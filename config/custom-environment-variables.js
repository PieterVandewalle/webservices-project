module.exports = {
  env: 'NODE_ENV',
  port: 'PORT',
  auth: {
    jwksUri: 'AUTH_JWKS_URI',
    audience: 'AUTH_AUDIENCE',
    issuer: 'AUTH_ISSUER',
    tokenUrl: 'AUTH_TOKEN_URL',
    clientId: 'AUTH_CLIENT_ID',
    clientSecret: 'AUTH_CLIENT_SECRET',
    m_to_m_clientId: 'AUTH_M_TO_M_APP_CLIENT_ID',
    m_to_m_clientSecret: 'AUTH_M_TO_M_APP_CLIENT_SECRET',
    userRole: 'AUTH_USER_ROLE_ID',
    testUser: {
      userId: 'AUTH_TEST_USER_USER_ID',
      username: 'AUTH_TEST_USER_USERNAME',
      password: 'AUTH_TEST_USER_PASSWORD',
    },
    testUserAdmin: {
      userId: 'AUTH_TEST_ADMIN_USER_ID',
      username: 'AUTH_TEST_ADMIN_USERNAME',
      password: 'AUTH_TEST_ADMIN_PASSWORD',
    }
  },
  azureStorageConnectionString: 'AZURE_STORAGE_CONNECTION_STRING',
  azureBaseUrl: 'AZURE_BASE_URL'
}
