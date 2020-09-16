const crypto = require('crypto');
const { request } = require('./request');
const url = 'https://kop.kuaidihelp.com/api';
const appId = '100687';
const appKey = 'ed51dbd0ffb2a5bbbb8aede0c3bdc1ec40b41de1';
// 计算签名
function getSign(method, ts) {
  const signStr = appId + method + ts + appKey;
  const h = crypto.createHash('md5');
  h.update(signStr);
  return h.digest('hex');
}
module.exports = {
  // 智能解析收货地址
  resolveAddress: async (addressStr) => {
    const method = 'cloud.address.resolve';
    const ts = Date.now();
    const sign = getSign(method, ts);
    const param = JSON.stringify({
      text: addressStr,
      multimode: true,
    });
    const data = { method, ts, sign, data: param, app_id: appId };
    uniCloud.logger.info('智能解析收货地址(api)-入参', data);
    const res = await request({
      url,
      data,
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
    });
    uniCloud.logger.info('智能解析收货地址(api)-出参', res);
    return res;
  },
};
