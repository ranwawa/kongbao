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
    const { tabType, money, src } = options;
    if (
      (tabType !== 'wechat' && tabType !== 'alipay')
      || typeof money !== 'number'
      || (typeof src !== 'string' && src.indexOf(OOS_URL) === -1)
    ) {
      return new this.ResponseModal(400, {}, '参数异常');
    }
    const res = await colAgInfo.where({
      isDelete: false,
      isEnable: true,
      appId: this.appId,
    })
      .update({
        [`qr.${options.tabType}.${options.money}`]: {
          money: options.money,
          src: options.src,
        },
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
    return this.processResponseData(res, '根据appId查询代理分站信息', true);
  }
  /**
   * 删除某张二维码
   */
  async removeQr(options) {
    uniCloud.logger.info('删除某张二维码-入参', options);
    const res = await colAgInfo.where({
      appId: this.appId,
      isDelete: false,
      isEnable: true,
    }).update({
      [`qr.${options.tabType}.${options.money}`]: dbCmd.remove()
    });
    return this.processResponseData(res, '根据appId查询代理分站信息');
  }
};
