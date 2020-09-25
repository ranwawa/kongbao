/**
 * @file 平台重要日志相关
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/24 14:42
 */
const { db, ControllerBase } = require("api");
const { colPlLog, _ } = db;

module.exports = class PlatformLog extends ControllerBase {
  /**
   * 添加一条日志
   */
  async add(options) {
    this.logger.info("(platform-log)添加一条日志-入参", options);
    const res = await colPlLog.add(options);
    return this.processResponseData(res, "(platform-log)添加一条日志");
  }
  async removeAll() {
    const res = await colPlLog.where({ _id: _.exists(true) }).remove();
    return this.processResponseData(res, "删除全部日志");
  }
};
