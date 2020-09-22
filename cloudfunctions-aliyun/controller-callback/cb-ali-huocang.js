/**
 * @file 阿里货仓批量下单回调
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 10:20
 */
const { callFunc, ControllerBase } = require("api");
const Error = { success: false };
module.exports = class AliHuoCang extends ControllerBase {
  /**
   * 批量下单接口回调
   */
  async confirm(options) {
    uniCloud.logger.log("(cb-ali-huocang)批量下单接口回调-入参", options);
    // 清洗响应参数
    const data = this.processOptions(options);
    if (data.length < 1) {
      return Error;
    }
    // 更新响应参数
    const param = await this.mergeAddressInfo(data);
    if (!param.orderId || param.addressInfo.length < 1) {
      return Error;
    }
    // 将更新后的参数同步到数据库
    const [, data2] = await callFunc({
      name: "controller-backend",
      action: "customer-order/updateOrderInfo",
      data: {
        ...param,
        preStatus: 3,
        nextStatus: 5,
      },
    });
    if (!data2 || !data.affectedDocs < 1) {
      return Error;
    }
    return { success: true };
  }
  /**
   * 加工传进来的参数
   */
  processOptions(options) {
    let res = [];
    if (!options) {
      return res;
    }
    const newData = decodeURIComponent(options).split("=");
    res = JSON.parse(newData[1] || "[]");
    uniCloud.logger.log("(cb-ali-huocang)加工传进来的参数-出参", res);
    return res;
  }
  /**
   * 合并地址信息
   */
  async mergeAddressInfo(options) {
    let res = {};
    const [, res2] = await callFunc({
      name: "controller-backend",
      action: "customer-order/getOrderAddressByBatchCode",
      data: options[0].batchNo,
    });
    uniCloud.logger.log("(cb-ali-huocang)合并地址信息,查询地址-出参", res2);
    if (!res2 || !res2._id) {
      return res;
    }
    const { _id, addressInfo, appId, userId } = res2;
    let spAmount = 0;
    const addressInfoNew = addressInfo.map((ele) => {
      const addrItem = options.find((item) => {
        return item.thirdOrderNo === ele.addressId && item.success === "true";
      });
      if (!addrItem) {
        return ele;
      }
      spAmount += +(addrItem.amount * 100).toFixed(2);
      return {
        ...ele,
        recordId: addrItem.recordId,
        spAmount: addrItem.amount,
      };
    });
    res = {
      appId,
      userId,
      spAmount,
      orderId: _id,
      addressInfo: addressInfoNew,
    };
    uniCloud.logger.log("(cb-ali-huocang)加工传进来的参数-出参", res);
    return res;
  }
};
