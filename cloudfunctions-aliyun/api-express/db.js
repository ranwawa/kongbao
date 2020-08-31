const db = uniCloud.database();
const dbCmd = db.command;
// 供应商表
const colSp = db.collection("kb-sp-infos");
// 代理表
const colAg = db.collection("kb-ag-infos");
// 供应商仓库表
const colStore = db.collection("kb-sp-stores");
// 供应商商品表
const colSpGoods = db.collection("kb-sp-goods");
// 代理商品表
const colAgGoods = db.collection("kb-ag-goods");
const colModelMap = db.collection("kb-model-map");

module.exports = {
  dbCmd,
  colSp,
  colStore,
  colSpGoods,
  colAgGoods,
  colModelMap,
};
