const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;
const colSpGoods = db.collection("kb-sp-goods");
const colAgGoods = db.collection("kb-ag-goods");

module.exports = {
  $,
  dbCmd,
  colSpGoods,
  colAgGoods,
};
