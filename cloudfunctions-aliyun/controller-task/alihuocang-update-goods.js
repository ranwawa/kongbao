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
};
