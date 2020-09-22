const uniID = require("uni-id");
async function checkToken(token) {
  uniCloud.logger.log("(main-func)验证token-入参", token);
  if (!token) {
    return {};
  }
  const res = await uniID.checkToken(token);
  uniCloud.logger.log("(main-func)验证token-出参", res.code);
  return res.code === 0 ? res.userInfo : {};
}
module.exports = async function (event, context, fileMap) {
  const { action = "", data = {}, uniIdToken = "" } = event;
  const userInfo = await checkToken(uniIdToken);
  const { APPID } = context;
  const [fileName, funcName] = action.replace(/^\//, "").split("/");
  const fileClass = fileMap[fileName];
  if (!fileName || !fileClass || !funcName) {
    return { code: 404001, msg: "未找到访问的接口" };
  }
  const instance = new fileClass(APPID, userInfo);
  if (!instance[funcName]) {
    return { code: 404002, msg: "未找到访问的接口" };
  }
  if (instance.checkToken) {
    const res = await instance.checkToken();
    return res.code !== 0
      ? res
      : await instance[funcName](data, event, context);
  }
  // todo 验证appId,以防止请求时篡改appId会查出所有数据来
  return await instance[funcName](data, event, context);
};
