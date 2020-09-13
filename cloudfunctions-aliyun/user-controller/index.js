const UserNormal = require("./user-normal");
const UserAuth = require("./user-auth");
const NOT_FOUND = {
  code: 404,
  msg: "未找到访问的接口",
};

exports.main = async function (event, context) {
  const { action, data, uniIdToken } = event;
  const { APPID } = context;
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
