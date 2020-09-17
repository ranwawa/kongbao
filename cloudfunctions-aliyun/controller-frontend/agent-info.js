/**
 * @file 代理分站的相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 15:20
 */
const { ControllerBase, db } = require('api');
const { colAgInfo, dbCmd } = db;
const OOS_URL = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-kongbao';
module.exports = class AgentInfo extends ControllerBase {
  constructor(appId) {
    super(appId);
  }
  /**
   * 新增收款二维码
   */
  async addQrCode(options) {
    uniCloud.logger.info('新增收款二维码-入参', options);
    const { payType, money, src } = options;
    if (
      (payType !== 1 && payType !== 2) ||
      typeof money !== 'number' ||
      (typeof src !== 'string' && src.indexOf(OOS_URL) === -1)
    ) {
      return new this.ResponseModal(400, {}, '参数异常');
    }
    const payTypeStr = payType === 1 ? 'alipay' : 'wechat';
    const res = await colAgInfo.where({
      isDelete: false,
      isEnable: true,
      appId: this.appId,
    })
      .update({
        [`qr.${payTypeStr}.${money}`]: { money, src },
      });
    return this.processResponseData(res, '新增收款二维码');
  }
  /**
   * 根据appId查询代理分站信息
   */
  async getSingleByAppId(options) {
    uniCloud.logger.info('根据appId查询代理分站信息-入参', options);
    const res = await colAgInfo
      .aggregate()
      .match({
      appId: this.appId,
      isDelete: false,
      isEnable: true,
    })
      .project({
        _id: false,
        agentId: '$_id',
        siteInfo: true,
        qr: true,
      })
      .end();
    console.log(11111, res.data[0]);
    if (res.data.length > 0) {
      res.data = res.data.map(ele => {
        const { alipay, wechat } = ele.qr;
        for (let key in alipay) {
          const item = alipay[key];
          item.moneyStr = (item.money / 100).toFixed(2);
        }
        for (let key in wechat) {
          const item = wechat[key];
          item.moneyStr = (item.money / 100).toFixed(2);
        }
        return ele;
      })
    }
    return this.processResponseData(res, '根据appId查询代理分站信息', true);
  }
  /**
   * 删除某张二维码
   */
  async removeQr(options) {
    uniCloud.logger.info('删除某张二维码-入参', options);
    const payType = options.payType === 1 ? 'alipay' : 'wechat';
    const res = await colAgInfo.where({
      appId: this.appId,
      isDelete: false,
      isEnable: true,
    }).update({
      [`qr.${payType}.${options.money}`]: dbCmd.remove()
    });
    return this.processResponseData(res, '删除某张二维码');
  }
};
