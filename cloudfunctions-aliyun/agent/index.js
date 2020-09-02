const AgentGoods = require("./agent-goods");

exports.main = async (event, context) => {
  const { action, data } = event;
  const { APPID } = context;
  const instanceMap = {
    "agent-goods": new AgentGoods(APPID),
  };
  if (!action) {
    return {
      code: 404,
      msg: "未找到访问的接口",
    };
  }
  const [instanceKey, method] = action.split("/");
  const instance = instanceMap[instanceKey];
  await instance.removeAll();
  await instance.syncInfo(APPID);
  // if (!instance || !instance[method]) {
  //   return {
  //     code: 404,
  //     msg: "未找到访问的接口2",
  //   };
  // }
  // const res = await instance[method](data, APPID, event, context);
  // return res;
};
