'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const User = this.app.model.User;
    await new User({
      userName: '13',
      password: '12',
    }).save();
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
