const db = require("./db");
const api = require("api");
const md5 = require("md5");
const { request, ResponseModal } = api;
const { colStore, dbCmd } = db;
module.exports = class Store {
  constructor(spId = "", accessToken = "", modelMap = {}) {
    this.spId = spId;
    this.accessToken = accessToken;
    this.modelMap = modelMap;
    // 订阅者列表
    this.subscribers = {};
  }
  /**
   * 添加订阅者
   * @param eventName
   * @param eventHandler
   */
  addSubscriber(eventName, eventHandler = () => {}) {
    uniCloud.logger.log("订阅仓库相关事件-入参", eventName);
    !this.subscribers[eventName] && (this.subscribers[eventName] = []);
    this.subscribers[eventName].push(eventHandler);
  }
  /**
   * 发布通知
   */
  notify(eventName, newStoreItem) {
    const subscriberHandlerList = this.subscribers[eventName];
    if (!subscriberHandlerList) return;
    subscriberHandlerList.forEach((ele) => {
      ele(newStoreItem);
    });
  }
  /**
   * 从第3方获取仓库列表
   */
  async getListFromApi(requestBody) {
    uniCloud.logger.log("从第3方查询仓库-入参", requestBody);
    const [err, data] = await request(requestBody);
    uniCloud.logger.log("从第3方查询仓库-出参", err || data);
    return err || !data || !data.length ? [] : data;
  }
  /**
   * 获取查询参数
   * @param newStoreItem
   * @returns {{expressName: *, code: *, spId: *}}
   */
  getWhereParam(newStoreItem) {
    return {
      spId: this.spId,
      storeCode: newStoreItem.storeCode,
      storeName: newStoreItem.storeName,
    };
  }
  /**
   * 整合仓库实体
   * 需要将第3方仓库信息,转换成标准的仓库信息
   */
  combineStoreEntity(thirdStoreItem = {}) {
    // 遍历标准实体映射
    // 将第3方字段转存过来
    const entity = {};
    Object.entries(this.modelMap).forEach(([standardKey, thirdKey]) => {
      entity[standardKey] = thirdStoreItem[thirdKey];
    });
    entity.thirdObj = thirdStoreItem;
    entity.spId = this.spId;
    entity._id = md5(`${this.spId}-${entity.storeCode}`);
    entity.sort = 0;
    entity.updateTime = Date.now();
    uniCloud.logger.log("合并仓库实体数据-出参", entity);
    return entity;
  }
  /**
   * 新增一条仓库
   * @param entity
   * @returns {Promise<Object>}
   */
  async add(entity) {
    entity.createTime = Date.now();
    entity.isDeleted = false;
    entity.isEnable = true;
    const res = await colStore.add(entity);
    uniCloud.logger.log("添加仓库-结果", res);
    return res;
  }
  /**
   * 查询一条仓库
   * @param entity
   */
  async get(entity) {
    const res = await colStore
      .where(this.getWhereParam(entity))
      .field({ _id: true })
      .get();
    uniCloud.logger.log("查询仓库-出参", res);
    return res;
  }
  /**
   * 查询所有仓库
   */
  async getList() {
    const res = await colStore
      .field({ _id: true, storeCode: true, storeName: true })
      .get();
    uniCloud.logger.log("查询所有仓库-出参", res);
    return new ResponseModal(0, res);
  }
  /**
   * 更新一条仓库
   * @param id
   * @param entity
   */
  async update(id, entity) {
    const res = await colStore.doc(id).set(this.combineStoreEntity(entity));
    uniCloud.logger.log("更新一条仓库-出参", res);
    return res;
  }
  /**
   * 删除仓库所有纪录
   * @returns {Promise<{deleted: number}>}
   */
  async removeAll() {
    const res = await colStore.where({ _id: dbCmd.exists(true) }).remove();
    uniCloud.logger.info("删除全部仓库-出参", res);
    return res;
  }
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
};
