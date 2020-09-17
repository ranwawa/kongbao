const uniID = require("uni-id");
async function checkToken(token) {
  if (!token) {
    return {};
  }
  const res = await uniID.checkToken(token);
  uniCloud.logger.log("验证token-出参", res);
  return res.code === 0 ? res.userInfo : {};
}
module.exports = async function (event, context, fileMap) {
  const { action = "", data = {}, uniIdToken = "" } = event;
  const userInfo = await checkToken(uniIdToken);
  const { APPID } = context;
  const [fileName, funcName] = action.split("/");
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
  return await instance[funcName](data, event, context);
};
