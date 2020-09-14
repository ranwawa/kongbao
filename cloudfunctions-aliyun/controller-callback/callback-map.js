/**
 * @file 阿里货仓批量下单回调
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 10:20
 */
const { callFunc } = require('api');
const aliHuoCang = async (options) => {
  uniCloud.logger.log('阿里货仓回调-入参', options);
  if (!options) {
    return { success: false };
  }
  const newData = decodeURIComponent(options).split('=');
  const newBody = JSON.parse(newData[1] || '[]');
  if (!Array.isArray(newBody) || newBody.length < 1) {
    return { success: false };
  }
  const [, data] = await callFunc({
    name: 'controller-backend',
    action: 'customer-order/getOrderAddressByBatchCode',
    data: newBody[0].batchNo,
  });
  if (!data || !data._id) {
    return { success: false };
  }
  const { _id, addressInfo } = data;
  const addressInfoNew = addressInfo.map((ele) => {
    const addressItem = newBody.find(
      (item) => item.thirdOrderNo === ele.addressId,
    );
    return {
      ...ele,
      recordId: addressItem.recordId,
      spAmount: addressItem.amount,
    };
  });
  const [, data2] = await callFunc({
    name: 'controller-backend',
    action: 'customer-order/updateOrderAddressRecordId',
    data: {
      orderId: _id,
      addressInfo: addressInfoNew,
    },
  });
  if (!data2) {
    return { success: false };
  }
  return { success: true };
};
module.exports = {
  aliHuoCang,
};

