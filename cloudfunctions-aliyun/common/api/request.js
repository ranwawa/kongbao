/**
 * @file 请求第3方接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:15
 */
const requestBind = uniCloud.httpclient.request.bind(uniCloud.httpclient);

function handleResponseOK(data) {
  switch (data.code) {
    case 0:
      return [null, data.data];
    default:
      uniCloud.logger.error("第3方api数据异常", data);
      return [data, null];
  }
}
module.exports.request = async function (options) {
  const {
    url = "",
    method = "GET",
    data = {},
    contentType = "application/x-www-form-urlencoded",
  } = options;
  const res = await requestBind(url, {
    method,
    data,
    contentType,
    dataType: "json",
  });
  switch (res.status) {
    case 200:
      uniCloud.logger.info("第3方api正常响应", res.data);
      return handleResponseOK(res.data);
    default:
      uniCloud.logger.error("第3方api异常响应", res);
      return [res, null];
  }
};
