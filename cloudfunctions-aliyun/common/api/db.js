const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
const colSpInfos = db.collection("kb-sp-infos");
const colSpStore = db.collection("kb-sp-stores");
const colSpGoods = db.collection("kb-sp-goods");
const colAgGoods = db.collection("kb-ag-goods");
const colAgFund = db.collection("kb-ag-fund");
const colAgInfo = db.collection("kb-ag-infos");
const colCsAddress = db.collection("kb-cs-address");
const colCsOrder = db.collection("kb-cs-order");
const colCsFund = db.collection("kb-cs-fund");
const colCsFundOrder = db.collection("kb-cs-fund-order");

module.exports = {
  $,
  dbCmd,
  colSpInfos,
  colSpGoods,
  colSpStore,
  colAgGoods,
  colAgInfo,
  colAgFund,
  colCsAddress,
  colCsOrder,
  colCsFund,
  colCsFundOrder,
};
