const db = uniCloud.database();
const dbCmd = db.command;
const colSpGoods = db.collection("kb-sp-goods");
const colAgGoods = db.collection("kb-ag-goods");

module.exports = {
  dbCmd,
  colSpGoods,
  colAgGoods,
};
