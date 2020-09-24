const moment = require("moment");
const md5 = require("md5");
const lodash = require("lodash");

function yuan2fen(str) {
  return +(+str * 100).toFixed(0);
}
function fen2yuan(num) {
  return +(num / 100).toFixed(2);
}

module.exports = {
  md5,
  lodash,
  moment,
  yuan2fen,
  fen2yuan,
};
