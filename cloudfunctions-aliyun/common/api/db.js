const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
// 平台相关集合
const colPlLog = db.collection("kb-pl-log");
// 供应商相关集合
const colSpInfos = db.collection("kb-sp-infos");
const colSpStore = db.collection("kb-sp-stores");
const colSpGoods = db.collection("kb-sp-goods");
const colSpStoreGoods = db.collection("kb-sp-store-goods");
// 代理分站相关集合
const colAgGoods = db.collection("kb-ag-goods");
const colAgFund = db.collection("kb-ag-fund");
const colAgInfo = db.collection("kb-ag-infos");
// 用户相关集合
const colCsUser = db.collection("uni-id-users");
const colCsAddress = db.collection("kb-cs-address");
const colCsOrder = db.collection("kb-cs-order");
const colCsFund = db.collection("kb-cs-fund");
const colCsFundOrder = db.collection("kb-cs-fund-order");
const colCsVip = db.collection("kb-cs-vip");

module.exports = {
  $,
  _: dbCmd,
  dbCmd,
  /* 平台相关 */
  colPlLog,
  /* 供应商相关 */
  colSpInfos,
  colSpGoods,
  colSpStore,
  colSpStoreGoods,
  /* 分站代理相关 */
  colAgGoods,
  colAgInfo,
  colAgFund,
  /* 用户相关 */
  colCsUser,
  colCsAddress,
  colCsOrder,
  colCsFund,
  colCsFundOrder,
  colCsVip,
};
