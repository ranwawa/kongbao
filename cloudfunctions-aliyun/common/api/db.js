const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
// 供应商相关集合
const colSpInfos = db.collection("kb-sp-infos");
const colSpStore = db.collection("kb-sp-stores");
const colSpGoods = db.collection("kb-sp-goods");
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

module.exports = {
  $,
  _: dbCmd,
  dbCmd,
  colSpInfos,
  colSpGoods,
  colSpStore,
  colAgGoods,
  colAgInfo,
  colAgFund,
  /* 用户相关 */
  colCsUser,
  colCsAddress,
  colCsOrder,
  colCsFund,
  colCsFundOrder,
};
