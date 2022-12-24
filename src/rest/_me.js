const Router = require('@koa/router');
const postService = require('../service/post');
const favoritePostService = require('../service/favorite');
const conversationService = require('../service/conversation');
const messageService = require('../service/message');
const userService = require('../service/user');
const { requireInConversation, permissions, hasPermission, registerAndSetUserId} = require('../core/auth');
const Joi = require('joi');
const { validate } = require('./_validation');

// ----------Favorites--------------------------------------------------------------------------
const getUserFavoritePosts = async(ctx) => {
  ctx.body = await postService.getAllUserFavorites(ctx.state.userId,ctx.query);
}

getUserFavoritePosts.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().max(1000).optional(),
    offset: Joi.number().min(0).optional(),
  }).and('limit', 'offset'),
}

const createFavorite = async(ctx) => {
    ctx.body = await favoritePostService.createFavorite(ctx.state.userId, ctx.params.postId);
    ctx.status = 201;
}

createFavorite.validationScheme = {
  params: {
    postId: Joi.number().integer().positive(),
  },
}

const deleteFavorite = async(ctx) => {
    ctx.body = await favoritePostService.deleteFavorite(ctx.state.userId, ctx.params.postId);
    ctx.status = 204;
};

deleteFavorite.validationScheme = {
  params: {
    postId: Joi.number().integer().positive(),
  },
}

// ----------Posts--------------------------------------------------------------------------
const getUserPosts = async(ctx) => {
  ctx.body = await postService.getAllByUserId(parseInt(ctx.state.userId),ctx.query);
}

getUserPosts.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().max(1000).optional(),
    offset: Joi.number().min(0).optional(),
  }).and('limit', 'offset'),
}

// ----------Conversations and messages--------------------------------------------------------------------------
const createConversation = async(ctx) => {
  ctx.body = await conversationService.create({...ctx.request.body, postReplierId: ctx.state.userId});
  ctx.status = 201;
}

createConversation.validationScheme = {
  body: {
    postId: Joi.number().positive().max(1000).optional(),
  },
}

const getUserConversations = async(ctx) => {
  ctx.body = await conversationService.getAllByUserId(parseInt(ctx.state.userId));
}

const getConversationById = async(ctx) => {
  ctx.body = await conversationService.getById(ctx.params.conversationId);
}

getConversationById.validationScheme = {
  params: {
    conversationId: Joi.number().integer().positive(),
  },
}

const deleteConversationById = async(ctx) => {
  ctx.body = await conversationService.deleteById(ctx.params.conversationId, ctx.state.userId);
  ctx.status = 204;
}

deleteConversationById.validationScheme = {
  params: {
    conversationId: Joi.number().integer().positive(),
  },
}

const createMessage = async(ctx) => {
  ctx.body = await messageService.create({
    conversationId: ctx.params.conversationId, 
    senderId: ctx.state.userId,
    ...ctx.request.body
  });
  ctx.status = 201;
}

createMessage.validationScheme = {
  params: {
    conversationId: Joi.number().integer().positive(),
  },
  body: {
    content: Joi.string().max(255)
  }
}

const getProfile = async(ctx) => {
  ctx.body = await userService.getById(ctx.state.userId);
} 


module.exports = (app) => {
    const router = new Router({
      prefix: '/me',
    });
    router.get('/profile', registerAndSetUserId, hasPermission(permissions.user),getProfile);
    router.get('/favorites',registerAndSetUserId, hasPermission(permissions.user),validate(getUserFavoritePosts.validationScheme),getUserFavoritePosts);
    router.post("/favorites/:postId",registerAndSetUserId, hasPermission(permissions.user), validate(createFavorite.validationScheme), createFavorite);
    router.delete("/favorites/:postId",registerAndSetUserId, hasPermission(permissions.user), validate(deleteFavorite.validationScheme),deleteFavorite);

    router.get('/posts',registerAndSetUserId, hasPermission(permissions.user), validate(getUserPosts.validationScheme), getUserPosts);

    router.get('/conversations',registerAndSetUserId, hasPermission(permissions.user), getUserConversations);
    router.post("/conversations",registerAndSetUserId, hasPermission(permissions.user), validate(createConversation.validationScheme), createConversation);
    router.delete("/conversations/:conversationId",registerAndSetUserId, hasPermission(permissions.user),validate(deleteConversationById.validationScheme), requireInConversation, deleteConversationById);

    router.get('/conversations/:conversationId',registerAndSetUserId, hasPermission(permissions.user),validate(getConversationById.validationScheme), requireInConversation, getConversationById);
    router.post("/conversations/:conversationId/messages",registerAndSetUserId, hasPermission(permissions.user),validate(createMessage.validationScheme), requireInConversation,createMessage);

    app
    .use(router.routes())
    .use(router.allowedMethods());
};
  