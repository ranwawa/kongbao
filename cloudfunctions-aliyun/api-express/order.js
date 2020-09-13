const api = require("api");
const db = require("./db");
const md5 = require("md5");
const { colSpGoods, dbCmd } = db;
const { request, ResponseModal } = api;
module.exports = class Order {
  constructor(spId, accessToken) {
    this.spId = spId;
    this.accessToken = accessToken;
  }
};
