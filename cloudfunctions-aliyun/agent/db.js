const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
const colSpGoods = db.collection("kb-sp-goods");
const colAgGoods = db.collection("kb-ag-goods");
const colAgOrder = db.collection("kb-ag-order");

module.exports = {
  $,
  dbCmd,
  colSpGoods,
  colAgGoods,
  colAgOrder,
};
