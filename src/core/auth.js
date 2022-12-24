const userService = require('../service/user');
const postService = require('../service/post');
const conversationService = require('../service/conversation');

const jwt = require('koa-jwt');
const jwksrsa = require('jwks-rsa');
const config = require('config');

const AUTH_TOKEN_ENDPOINT=config.get('auth.tokenUrl');
const AUTH_M_TO_M_APP_CLIENT_ID=config.get('auth.m_to_m_clientId');
const AUTH_M_TO_M_APP_CLIENT_SECRET=config.get('auth.m_to_m_clientSecret');
const AUTH_USER_ROLE_ID=config.get('auth.userRole');
const AUTH_MGMT_API_AUDIENCE = `${config.get("auth.issuer")}api/v2/`;
const AUTH_MGMT_API_BASE_URL = `${config.get('auth.issuer')}api/v2`;

const {
	getLogger,
} = require('./logging');
const { default: axios } = require('axios');

function getJwtSecret() {
	const logger = getLogger();
	try {
		let secretFunction = jwksrsa.koaJwtSecret({
			jwksUri: config.get('auth.jwksUri'),
			cache: true,
			cacheMaxEntries: 5,
		});
		return secretFunction;
	} catch (error) {
		logger.error('Something went wrong when handling the JWT secret', { error });
		throw error;
	}
}

function checkJwtToken() {
	const logger = getLogger();
	try {
		let secretFunction = getJwtSecret();
		return jwt({
			secret: secretFunction,
			audience: config.get('auth.audience'),
			issuer: config.get('auth.issuer'),
			algorithms: ['RS256'],
			passthrough: true, // ctx.state.user will be undefined if no valid JWT is provided
		});
	} catch (error) {
		logger.error('Something went wrong when checking the JWT', { error });
		throw error;
	}
}

const getManagementToken = async() => {
	const logger = getLogger();
	try {
		logger.debug("Fetching management access token");
		const {data}= await axios.post(AUTH_TOKEN_ENDPOINT,
			new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: AUTH_M_TO_M_APP_CLIENT_ID,
				client_secret: AUTH_M_TO_M_APP_CLIENT_SECRET,
				audience: AUTH_MGMT_API_AUDIENCE
		}),
		{
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				'accept-encoding': '*'
			}
		});
		return data.access_token;
	} catch(error) {
		logger.error('Something went wrong when fetching management access token', { error });
		throw error;
	}
}

const assignUserRole = async(ctx, managementToken) => {
	const logger = getLogger();
	try {
		const url = `${AUTH_MGMT_API_BASE_URL}/users/${ctx.state.user.sub}/roles`;
		logger.debug(`assignUserRole: ${url}`);
		await axios.post(
			url,
			{
				roles: [AUTH_USER_ROLE_ID]
			},
			{
				headers: {
					'content-type': 'application/json',
					'authorization': `Bearer ${managementToken}`,
					'cache-control': 'no-cache'
				},
			}
		);
	} catch(error) {
		logger.error('Something went wrong when adding user role', { error });
		throw error;
	}
}

const addUserInfo = async (ctx, managementToken) => {
	const logger = getLogger();
	try {
		const url = `${AUTH_MGMT_API_BASE_URL}/users/${ctx.state.user.sub}`;
		logger.debug(`Get User info: ${url}, ${JSON.stringify(managementToken)}`);
		const userInfo = await axios.get(
			url,
			{
				headers: {
					'content-type': 'application/json',
					'authorization': `Bearer ${managementToken}`,
					'accept-encoding': '*'
				},
			}
		);
		ctx.state.user = {
			...ctx.state.user,
			...userInfo.data,
		};

	} catch(error) {
		logger.error('Something went wrong when getting user info', { error });
		throw error;
	}
}
//User permissions toevoegen aan ctx.state.user.permissions 
// Wanneer nieuwe permissions toegewezen worden aan user zal pas in de token te zien zijn als de gebruiker opnieuw inlogt ...
const addPermissionsToCtx = async (ctx,managementToken) => {
	const logger = getLogger();
	try {
		const url = `${AUTH_MGMT_API_BASE_URL}/users/${ctx.state.user.sub}/permissions`;
		logger.debug(`getUserPermissions: ${url}, ${JSON.stringify(managementToken)}`);
		const {data} = await axios.get(
			url,
			{
				headers: {
					'content-type': 'application/json',
					'authorization': `Bearer ${managementToken}`,
					'accept-encoding': '*'
				},
			}
		);
		ctx.state.user.permissions = data.map(({permission_name})=> permission_name);
	} catch(error) {
		logger.error('Something went wrong when getting user permissions', { error });
		throw error;
	}
}


const registerAndSetUserId= async(ctx, next) => {
	const user = ctx.state.user;

	if(!user)
		return next();

	let managementToken;
	let userInDb;

	try {
		userInDb = await userService.getByAuth0Id(user.sub);
	} catch(err){
		managementToken = await getManagementToken();
		await addUserInfo(ctx, managementToken);
		await assignUserRole(ctx, managementToken);
		userInDb = await userService.register({auth0id: ctx.state.user.sub, username: ctx.state.user.username});
	}finally {
		if(user.permissions.length === 0){
			managementToken = managementToken || await getManagementToken();
			await addPermissionsToCtx(ctx, managementToken);
		}

		ctx.state.userId = userInDb.id;
		await next();
	}
}

const permissions = Object.freeze({
	user: ['read', 'write'],
	admin: ['readAll', 'writeAll']
});

const requirePostOwner = async (ctx, next) => {
	//Post owner is degene die de post heeft geplaatst of een admin
	const user = ctx.state.user;
	const hasAdminPermissions = user && user.permissions && permissions.admin.every(permission => user.permissions.includes(permission));
	
	if(!hasAdminPermissions){
		const userId = ctx.state.userId;
		await postService.checkPostOwner(ctx.params.id, userId);
	}
	await next();
};

const requireInConversation = async (ctx, next) => {
	const userId = ctx.state.userId;
	await conversationService.checkInConversation(ctx.params.conversationId, userId);
	await next();
};

function hasPermission(permissionsArray) {
	return async (ctx, next) => {
		const logger = getLogger();
		const user = ctx.state.user;
		logger.debug(`hasPermission: ${JSON.stringify(user)}`);

		// bij gebruik van hasPermission veronderstel ik dat er een user is, anders throwen we 403
		if (!(user && user.permissions && permissionsArray.every(permission => user.permissions.includes(permission)))) {
			ctx.throw(403, 'You are not allowed to view this part of the application', {
				code: 'FORBIDDEN',
			});
		}
		await next();
	};
}

module.exports = {
 checkJwtToken, requirePostOwner, requireInConversation, hasPermission, permissions, registerAndSetUserId,
};

