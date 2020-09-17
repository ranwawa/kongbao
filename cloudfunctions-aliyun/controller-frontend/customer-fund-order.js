/**
 * @file 用户资金相关操作
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 15:20
 */
const { ControllerAuth, db } = require('api');
const { colCsFundOrder, dbCmd } = db;
module.exports = class CustomerFund extends ControllerAuth {
  constructor(appId, uniIdToken) {
    super(appId, uniIdToken);
  }
  /**
   * 创建充值订单
   */
  async add(money, payType) {
    // 新增纪录
    // 请求第3方接口
    // 查找二维码
    // 返回数据
    const now = Date.now();
    const param = {
      money,
      payType,
      appId: this.appId,
      userId: this.userInfo._id,
      isDelete: false,
      createTime: now,
      expireTime: now + 300000,
      status: 1, // 1待响应 2待支付 3已支付 5已超时 6已取消
    };
    uniCloud.logger.info('创建充值订单-入参', param);
    const res = await colCsFundOrder.add(param);
    uniCloud.logger.info('创建充值订单-出参', res);
    return new this.ResponseModal(0, res);
  }
  /**
   * 更新实际支付金额
   */
  async update(options) {
    const { fundOrderId, realPrice } = options;
    uniCloud.logger.info('更新实际支付金额-入参', options);
    const res = await colCsFundOrder.where({
      _id: fundOrderId,
      userId: this.userInfo._id,
      appId: this.appId,
      status: 1,
      isDelete: false,
    }).update({
      realPrice,
      status: 2,
    });
    return this.processResponseData(res, '更新实际支付金额');
  }
  /**
   * 根据ID查询支付订单信息
   * @param options
   * @returns {Promise<void>}
   */
  async getSingleById(options) {
    uniCloud.logger.info('根据ID查询支付订单信息-入参', options);
    const res = await colCsFundOrder
      .aggregate()
      .match({
        appId: this.appId,
        userId: this.userInfo._id,
        isDelete: false,
        status: 2,
        _id: options.fundOrderId,
      })
      .lookup({
        from: 'kb-ag-infos',
        localField: 'realPrice',
        foreignField: 'qr.wechat.2001.money',
        as: 'qrInfoList',
      })
      .addFields({
        fundOrderId: '$_id',
      })
      .project({
        '_id': false,
        realPrice: true,
        createTime: true,
        expireTime: true,
        qrInfoList: true,
      })
      .end();
    return this.processResponseData(res, '根据ID查询支付订单信息');
  }
};
