const { callFunc, apiALHC } = require("api");
module.exports = class AliHC {
  /**
   * 同步仓库信息
   * @returns {Promise<boolean>}
   */
  async syncInfo(requestBody = {}) {
    uniCloud.logger.info("同步仓库信息-入参", requestBody);
    // 从远程获取仓库信息
    // 查找本地仓库信息
    // 如果有则更新, 如果木有,则新增
    // 更新商品信息
    const newStoreList = await this.getListFromApi(requestBody);
    for (let newStoreItem of newStoreList) {
      const entity = this.combineStoreEntity(newStoreItem);
      // 发布更新商品的事件
      this.notify("syncGoodsInfo", entity);
      const oldStore = await this.get(entity);
      const [doc] = oldStore.data;
      doc ? await this.update(doc._id, entity) : await this.add(entity);
    }
  }
  async syncStore() {
    await apiALHC.findExpressNoList();
  }
};
