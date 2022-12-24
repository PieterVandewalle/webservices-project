const Router = require('@koa/router');

const installHealthRouter = require('./_health');
const installPostRouter= require('./_posts');
const installCategoryRouter = require('./_categories');
const installDeliveryTypeRouter = require('./_deliveryTypes');
const installUserRouter = require('./_users');
const installMeRouter = require('./_me');
/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});
	installCategoryRouter(router);
	installHealthRouter(router);
	installPostRouter(router);
	installDeliveryTypeRouter(router);
	installUserRouter(router);
	installMeRouter(router);
	app
	.use(router.routes())
	.use(router.allowedMethods());
};
