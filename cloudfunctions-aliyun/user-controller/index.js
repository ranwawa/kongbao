const UserNormal = require("./user-normal");
const UserAuth = require("./user-auth");
const NOT_FOUND = {
  code: 404,
  msg: "未找到访问的接口",
};

exports.main = async function (event, context) {
  const { action, data, uniIdToken } = event;
  const { APPID } = context;
  // todo 上线时删掉这个
  context.CLIENTUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
  const classMap = {
    "user-normal": UserNormal,
    "user-auth": UserAuth,
  };
  const [classKey, method] = action.split("/");
  if (!action || !classKey || !method) {
    return NOT_FOUND;
  }
  let instance = classMap[classKey];
  if (!instance) {
    return NOT_FOUND;
  }
  instance = new instance(APPID, uniIdToken);
  console.log(instance);
  if (!instance[method]) {
    return NOT_FOUND;
  }
  if (instance.checkToken) {
    const res = await instance.checkToken();
    if (res.code !== 0) {
      return {
        code: 401,
        msg: "请登录后访问",
      };
    }
  }
  return await instance[method](data, event, context);
};
