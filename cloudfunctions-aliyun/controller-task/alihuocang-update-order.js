const { callFunc, apiALHC } = require("api");
const SUPPLIER_ID = "5f4b16741179ce00015923a3"; // 阿里货仓ID
module.exports = async function () {
  // 获取供应商信息
  const [, spInfo] = await callFunc({
    name: "controller-backend",
    action: "supplier-info/getSupplierInfoById",
    data: SUPPLIER_ID,
  });
  if (!spInfo || !spInfo.accessToken) {
    uniCloud.logger.error("阿里货仓更新快递单号-未找到accessToken");
    return;
  }
  // 获取已经支付的订单信息
  const [, orderInfo] = await callFunc({
    name: "controller-backend",
    action: "customer-order/getOrderAddressByStatus",
    data: 3,
  });
  if (!orderInfo || orderInfo.length < 1) {
    uniCloud.logger.info("阿里货仓更新快递单号-木有待出库的快递单号");
    return;
  }
  // 拼接待出物流单号的地址信息
  const recordIds = orderInfo
    .map((ele) => {
      return ele.addressInfo
        .filter((address) => address.recordId && !address.expressNo)
        .map((address) => address.recordId)
        .join(",");
    })
    .filter((ele) => ele)
    .join(",");
  // 查询物流单号
  const [, thirdOrderList] = await apiALHC.findExpressNoList({
    recordIds,
    accessToken: spInfo.accessToken,
  });
  if (!thirdOrderList || thirdOrderList.length < 1) {
    uniCloud.logger.error("阿里货仓更新快递单号-接口未返回对应数据");
    return;
  }
  // 将查询出的物流单号,合并到订单信息里
  const now = Date.now();
  const orderInfoNew = orderInfo.map((ele) => {
    ele.addressInfo = ele.addressInfo.map((address) => {
      const thirdInfo = thirdOrderList.find(
        (item) => item.expressNo && item.recordId === address.recordId
      );
      address.expressNo = thirdInfo ? thirdInfo.expressNo : "";
      return address;
    });
    ele.storeTime = now;
    ele.status = 5;
    return ele;
  });
  // 更新订单
  const [, updateRes] = await callFunc({
    name: "controller-backend",
    action: "customer-order/updateOrderList",
    data: orderInfoNew,
  });
  if (!updateRes || updateRes.length < 1) {
    uniCloud.logger.info("阿里货仓更新快递单号-更新订单失败");
    return;
  }
  console.log(orderInfoNew);
};
