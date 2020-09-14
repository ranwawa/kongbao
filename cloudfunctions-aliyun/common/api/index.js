const db = require("./db");
const uniID = require("uni-id");
const { request } = require("./request");
const callFunc = require("./call-func");
const apiALHC = require("./api-alhc");

class ResponseModal {
  constructor(code, data, msg = "ok") {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

class ControllerBase {
  constructor(appId) {
    this.appId = appId;
    this.ResponseModal = ResponseModal;
  }
  /**
   * 加工查询数据
   * 用于按固定格式返回前端
   * @param res 响应数据
   * @param title 输出日志的标题
   * @param isPickFirst 是否转将数据转换成对象
   */
  async processResponseData(res, title = "--", isPickFirst = false) {
    uniCloud.logger.log(title + "-出参", res);
    let data = res.affectedDocs ? res.data || [] : [];
    isPickFirst && (data = data[0] || {});
    return new ResponseModal(0, data);
  }
}

class ControllerAuth extends ControllerBase {
  constructor(appId, uniIdToken) {
    super(appId);
    this.uniIdToken = uniIdToken;
  }
  /**
   * 验证token
   */
  async checkToken() {
    if (!this.uniIdToken) {
      return new this.ResponseModal(401, "请登录后访问");
    }
    const res = await uniID.checkToken(this.uniIdToken);
    uniCloud.logger.log("验证token-出参", res);
    if (res.code !== 0) {
      return res;
    }
    if (res.appId === this.appId) {
      uniCloud.logger.warn("验证token", "注册时appId与登录时appId有差异");
    }
    this.userId = res.uid;
    return res;
  }
}

module.exports = {
  db,
  apiALHC,
  request,
  callFunc,
  ResponseModal,
  ControllerBase,
  ControllerAuth,
};
