'use strict';

const { Controller } = require('egg');

class UserController extends Controller {

  get userService() {
    return this.service.user;
  }

  async create() {
    const { ctx, userService } = this;
    const body = ctx.request.body;
    ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'password' },
    });

    if (await userService.findByUsername(body.username)) {
      ctx.throw(422, '用户名已存在');
    }

    if (await userService.findByEmail(body.email)) {
      ctx.throw(422, '邮箱已存在');
    }

    const user = await userService.createUser(body);

    const token = userService.createToken({
      userId: user._id,
    });

    ctx.body = {
      user: {
        token,
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async login() {
    const { ctx, userService } = this;
    const body = ctx.request.body;
    ctx.validate({
      email: { type: 'email' },
      password: { type: 'password' },
    });
    const user = await userService.findByEmail(body.email);

    if (!user) {
      ctx.throw(422, '用户不存在');
    }

    if (ctx.helper.md5(body.password) !== user.password) {
      ctx.throw(422, '密码不正确');
    }

    const token = userService.createToken({
      userId: user._id,
    });

    ctx.body = {
      user: {
        token,
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async getCurrentUser() {
    const { ctx } = this;
    const user = ctx.user;
    ctx.body = {
      user: {
        token: this.ctx.header.authorization,
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async update() {
    const { ctx } = this;
    const user = ctx.user;
    ctx.body = {
      user: {
        token: this.ctx.header.authorization,
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
      },
    };
  }

  async subscribe() {
    const userId = this.ctx.user._id;
    const channelId = this.ctx.params.userId;
    if (userId.equals(channelId)) {
      this.ctx.throw(422, '用不不能订阅自己');
    }

    const user = await this.service.user.subscribe(userId, channelId);
    this.ctx.body = user;
  }

}

module.exports = UserController;
