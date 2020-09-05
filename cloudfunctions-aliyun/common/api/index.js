const requestBind = uniCloud.httpclient.request.bind(uniCloud.httpclient);
const toString = Object.prototype.toString;

class ResponseModal {
  constructor(code, data, msg = "ok") {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}
function handleResponseOK(data) {
  switch (data.code) {
    case 0:
      return [null, data.data];
    default:
      uniCloud.logger.error("第3方api数据异常", data);
      return [data.msg, null];
  }
}
module.exports.request = async function (options) {
  const { url = "", method = "get", data = {} } = options;
  const res = await requestBind(url, {
    method,
    data,
    dataType: "json",
  });
  switch (res.status) {
    case 200:
      uniCloud.logger.info("第3方api正常响应", res.data);
      return handleResponseOK(res.data);
    default:
      uniCloud.logger.error("第3方api异常响应", res);
      return [res.status, null];
  }
};

module.exports.ResponseModal = ResponseModal;
