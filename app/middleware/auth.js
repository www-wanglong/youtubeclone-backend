module.exports = () => {
  return async function auth(ctx, next) {

    let token = ctx.headers.authorization;
    token = token ? token.split('Bearer ')[1] : null;

    if (!token) {
      ctx.throw(401);
    }

    try {
      const data = ctx.service.user.verifyToken(token);
      const user = await ctx.model.User.findById(data.userId);
      ctx.user = user;
    } catch (err) {
      ctx.throw(401);
    }

    await next();

  };
};
