const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
// 平台相关集合
const colPlLog = db.collection("kb-pl-log");
const colPlCities = db.collection("kb-pl-cities");
const colPlExpress = db.collection("kb-pl-express");
// 供应商相关集合
const colSpInfos = db.collection("kb-sp-infos");
const colSpStore = db.collection("kb-sp-stores");
const colSpGoods = db.collection("kb-sp-goods");
const colSpStoreGoods = db.collection("kb-sp-store-goods");
const colSpStoreExpress = db.collection("kb-sp-store-express");
// 代理分站相关集合
const colAgGoods = db.collection("kb-ag-goods");
const colAgFund = db.collection("kb-ag-fund");
const colAgInfo = db.collection("kb-ag-infos");
const colAgService = db.collection("kb-ag-service");
// 用户相关集合
const colCsUser = db.collection("uni-id-users");
const colCsOrder = db.collection("kb-cs-order");
const colCsOrderSub = db.collection("kb-cs-order-sub");
const colCsFund = db.collection("kb-cs-fund");
const colCsFundOrder = db.collection("kb-cs-fund-order");
const colCsVip = db.collection("kb-cs-vip");

module.exports = {
  $,
  _: dbCmd,
  dbCmd,
  /* 平台相关 */
  colPlLog,
  colPlCities,
  colPlExpress,
  /* 供应商相关 */
  colSpInfos,
  colSpGoods,
  colSpStore,
  colSpStoreGoods,
  colSpStoreExpress,
  /* 分站代理相关 */
  colAgGoods,
  colAgInfo,
  colAgFund,
  colAgService,
  /* 用户相关 */
  colCsUser,
  colCsOrder,
  colCsOrderSub,
  colCsFund,
  colCsFundOrder,
  colCsVip,
};
