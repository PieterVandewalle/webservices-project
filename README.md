# Examenopdracht Web Services

- Student: Pieter Vandewalle
- Studentennummer: 201637406
- E-mailadres: pieter.vandewalle.y7406@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

### Auth0 configuration
Enable requires username: https://auth0.com/docs/authenticate/database-connections/require-username
#### Roles and Permissions
Create the following permissions for your api <br><br>
![image](https://user-images.githubusercontent.com/67506292/207293899-7f00817a-0adf-44d8-be40-902300bec230.png)


Add 2 Roles for your application:

- User: permissions: read, write
- Admin: permissions: read, write, readAll, writeAll

Create a new **Machine to Machine application** and authorize it to use the Auth0 Management API with the following permissions:

```
read:users
update:users,
read:roles,
create:role_members
```

### Microsoft Azure Storage Account

You need a Microsoft Azure Storage Account to run the application:
https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create

When running the application (in development, testing or production) a container will get created in your storage account to store the uploaded images.


## How to start
To start this API, create a `.env` file in the root of this folder with this content
```
NODE_ENV="development"
DATABASE_URL= your database connection URL ex. mysql://myuser:mypassword@localhost:3306/mydb
AUTH_JWKS_URI=your auth0 domain/.well-known/jwks.json
AUTH_AUDIENCE=your unique auth0 id for the webservice
AUTH_ISSUER=your auth0 domain
AUTH_TOKEN_URL=your auth0 domain/oauth/token

AUTH_M_TO_M_APP_CLIENT_ID=your auth0 machine-to-machine application client id
AUTH_M_TO_M_APP_CLIENT_SECRET=your auth0 machine-to-machine application client secret
AUTH_USER_ROLE_ID=the id of the user role you created in auth0

AZURE_STORAGE_CONNECTION_STRING=Your azure storage account's connection string
AZURE_BASE_URL=Your azure storage account base url ex. https://mystorageaccount.blob.core.windows.net
```
### Running the app in development
First, install the dependencies using yarn install.
Start the application in development mode with `yarn start`.

### Running the app in production
Build the app in production with: `yarn build:prod`. 
Run the app in production mode with `yarn start:prod`. We then assume all necessary environment variables are set, no .env file is ever read with this command.

## How to test
Create a `.env.test` with a similar configuration as above (use another database) and these extra's:

```
AUTH_CLIENT_ID=your auth0 application client id
AUTH_CLIENT_SECRET=your auth0 application client id secret

AUTH_TEST_USER_USER_ID=your test user (assigned user role) id
AUTH_TEST_USER_USERNAME= your test user (assigned user role) username
AUTH_TEST_USER_PASSWORD=your test user (assigned user role) password

AUTH_TEST_ADMIN_USER_ID=your test user (assigned admin role) id
AUTH_TEST_ADMIN_USERNAME==your test user (assigned admin role) username
AUTH_TEST_ADMIN_PASSWORD=your test user (assigned admin role) password
```

Run the tests with `yarn test`. To get coverage run `yarn test:coverage`.
## Common errors

* Modules not found errors, try this and run again:

```
yarn install
```

* Migrations failed, try dropping the existing database and run the migrate command again

* Others: Google is your friend
