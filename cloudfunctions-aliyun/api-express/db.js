const db = uniCloud.database();
const dbCmd = db.command;
const colSp = db.collection("kb-sp-infos");
const colStore = db.collection("kb-sp-stores");
const colGoods = db.collection("kb-sp-goods");
const colModelMap = db.collection("kb-model-map");

module.exports = {
  dbCmd,
  colSp,
  colStore,
  colGoods,
  colModelMap,
};
