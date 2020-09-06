const uniId = require("uni-id");
const { ResponseModal } = require("api");

class User {
  constructor(event, context) {
    this.event = event;
    this.context = context;
  }
  async register(data, appId) {
    return await uniId.register({
      appId: appId,
      isVip: false,
      balance: 0,
      ...data,
    });
  }
  async login(data) {
    const res = await uniId.login({
      ...data,
      queryField: ["username", "email", "mobile"],
    });
    uniCloud.logger.info("帐户密码登录-出参", res);
    return new ResponseModal(res.code, res, res.msg);
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
