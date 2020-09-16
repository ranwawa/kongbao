/**
 * @file 供应商仓库相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/16 15:16
 */
const { db, ControllerBase } = require('api');
const { colSpStore } = db;
module.exports = class SupplierStore extends ControllerBase {
  constructor(appId) {super(appId);}
  /**
   * 获取仓库列表
   */
  async getList() {
    const res = await colSpStore.where({
      isDeleted: false,
      isEnable: true,
    })
      .field({
        _id: false,
        storeName: true,
        storeCode: true,
      })
      .get();
    return this.processResponseData(res, '获取仓库列表');
  }
};
