const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
const colSpGoods = db.collection("kb-sp-goods");
const colAgGoods = db.collection("kb-ag-goods");
const colAgAddress = db.collection("kb-ag-address");

module.exports = {
  $,
  dbCmd,
  colSpGoods,
  colAgGoods,
  colAgAddress,
};
