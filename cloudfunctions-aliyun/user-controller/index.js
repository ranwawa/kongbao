const uniId = require("uni-id");

class User {
  constructor(event, context) {
    this.event = event;
    this.context = context;
  }
  async register(data, appId) {
    return await uniId.register({
      app_id: appId,
      ...data,
    });
  }
  async login(data) {
    return await uniId.login({
      ...data,
      queryField: ["username", "email", "mobile"],
    });
  }
}

try {
  exports.main = async function (event, context) {
    const { action, data } = event;
    const { APPID } = context;
    const user = new User(event, context);
    const controller = user[action];
    return controller
      ? await controller(data, APPID, event, context)
      : { code: 404, msg: "未找到访问的接口" };
  };
} catch (e) {
  return { code: 500, msg: e.message };
}
