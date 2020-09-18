const md5 = require("md5");
const { request } = require("./request");
const BASE_URL = "https://pay.bearsoftware.net.cn/?format=json";
const NOTIFY_URL =
  "https://66108fd9-83f0-4fda-9219-f9fe3a6a377e.bspapp.com/http/cb/pays-api/payed";
const UID = "77c561bf719cd7cb972f8b9e";
const TOKEN = "3784648214cf83f20ceb9746880033a2";

module.exports = {
  // 调起paysApi接口
  pay: async (payType, money, orderId, userId, appId) => {
    uniCloud.logger.info("调起paysApi接口-入参", payType, money, orderId);
    // 将appId拼接进去,回调回来的时候可以用
    const userIdAndAppId = `${userId}and${appId}`;
    const key = md5(
      payType +
        NOTIFY_URL +
        orderId +
        userIdAndAppId +
        money +
        NOTIFY_URL +
        TOKEN +
        UID
    );
    const res = await request({
      url: BASE_URL,
      contentType: "application/json",
      data: {
        istype: payType,
        notify_url: NOTIFY_URL,
        orderid: orderId,
        orderuid: userIdAndAppId,
        price: money,
        return_url: NOTIFY_URL,
        uid: UID,
        key,
      },
    });
    uniCloud.logger.info("调起paysApi接口-出参", res);
    return res;
  },
};
