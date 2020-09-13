const AgentGoods = require("./agent-goods");
exports.main = async (event, context) => {
  const { action, data, uniIdToken } = event;
  const { APPID } = context;
  // todo 上线时删掉这个
  context.CLIENTUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
  const instanceMap = {
    "agent-goods": AgentGoods,
  };
  if (!action) {
    return { code: 404, msg: "未找到访问的接口" };
  }
  const [instanceKey, method] = action.split("/");
  const instance = new instanceMap[instanceKey](
    APPID || data.appId,
    uniIdToken
  );
  // await instance.removeAll();
  // await instance.syncInfo(APPID);
  if (!instance || !instance[method]) {
    return { code: 404, msg: "未找到访问的接口2" };
  }
  if (instance.checkToken) {
    const res = await instance.checkToken();
    if (res.code !== 0) {
      return { code: 401, msg: "请登录后访问" };
    }
  }
  return await instance[method](data, APPID, event, context);
};
