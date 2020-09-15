const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
const colSpInfos = db.collection("kb-sp-infos");
const colAgGoods = db.collection("kb-ag-goods");
const colAgFund = db.collection("kb-ag-fund");
const colAgInfo = db.collection("kb-ag-infos");
const colCsAddress = db.collection("kb-cs-address");
const colCsOrder = db.collection("kb-cs-order");
const colCsFund = db.collection("kb-cs-fund");

module.exports = {
  $,
  dbCmd,
  colAgGoods,
  colAgInfo,
  colAgFund,
  colSpInfos,
  colCsAddress,
  colCsOrder,
  colCsFund,
};
