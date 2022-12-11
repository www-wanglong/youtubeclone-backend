const Service = require('egg').Service;
const jwt = require('jsonwebtoken');

class UserService extends Service {

  get User() {
    return this.app.model.User;
  }

  findByUsername(username) {
    return this.User.findOne({
      username,
    });
  }

  findByEmail(email) {
    return this.User.findOne({
      email,
    }).select('+password');
  }

  async createUser(data) {
    data.password = this.ctx.helper.md5(data.password);
    const user = new this.User(data);
    await user.save();
    return user;
  }

  createToken(data) {
    return jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    });
  }

  verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret);
  }

  async subscribe(userId, channelId) {
    const { Subscription, User } = this.app.model;
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    const user = User.findById(userId);
    if (!record) {
      await new Subscription({
        user: userId,
        channel: channelId,
      }).save();
      user.subscribersCount++;
      await user.save;
    }
    return user;
  }
}

module.exports = UserService;
