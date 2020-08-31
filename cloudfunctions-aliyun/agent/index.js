const AgentGoods = require("./agent-goods");

const instanceMap = {
  "agent-goods": new AgentGoods(),
};
exports.main = async (event, context) => {
  const { action, data } = event;
  const { APPID } = context;
  if (!action) {
    return {
      code: 404,
      msg: "未找到访问的接口",
    };
  }
  const [instanceKey, method] = action.split("/");
  const instance = instanceMap[instanceKey];
  instance.syncInfo(APPID);
  // if (!instance || !instance[method]) {
  //   return {
  //     code: 404,
  //     msg: "未找到访问的接口2",
  //   };
  // }
  // return await instance[method](data, APPID, event, context);
};
