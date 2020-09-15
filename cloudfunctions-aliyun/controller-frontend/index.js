/**
 * @file 前端相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:55
 */
const AgentInfo = require("./agent-info");
const CustomerFund = require("./customer-fund");
const fileMap = {
  "agent-info": AgentInfo,
  "customer-fund": CustomerFund,
};
const NOT_FOUND = { code: 404, msg: "未找到访问的接口" };
exports.main = async (event, context) => {
  // todo 上线时删掉这个
  context.CLIENTUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
  const { action = "", data = {}, uniIdToken = "" } = event;
  const { APPID } = context;
  const [fileName, funcName] = action.split("/");
  const fileClass = fileMap[fileName];
  if (!fileName || !fileClass || !funcName) {
    return NOT_FOUND;
  }
  const instance = new fileClass(APPID, uniIdToken);
  if (!instance[funcName]) {
    return NOT_FOUND;
  }
  if (instance.checkToken) {
    const res = await instance.checkToken();
    return res.code !== 0
      ? res
      : await instance[funcName](data, event, context);
  }
  return await instance[funcName](data, event, context);
};
