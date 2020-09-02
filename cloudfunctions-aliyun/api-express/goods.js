const api = require("api");
const db = require("./db");
const md5 = require("md5");
const { colSpGoods, dbCmd } = db;
const { request, ResponseModal } = api;
module.exports = class Goods {
  constructor(spId, accessToken, modelMap = {}) {
    this.spId = spId;
    this.accessToken = accessToken;
    this.modelMap = modelMap;
  }
  /**
   * 从第3方接口获取商品列表
   */
  async getGoodsListFromApi(requestBody) {
    uniCloud.logger.log("从第3方查询商品-入参", requestBody);
    const [err, data] = await request(requestBody);
    uniCloud.logger.log("从第3方查询商品-出参", err || data);
    return err || !data || !data.length ? [] : data;
  }
  /**
   * 获取查询参数
   * @param goodsItem
   * @param storeCode
   * @returns {{code: *, name: *, spId: *, storeCode: *}}
   */
  getWhereParam(goodsItem, storeCode) {
    return {
      storeCode,
      spId: this.spId,
      goodsCode: goodsItem.goodsCode,
      goodsName: goodsItem.goodsName,
    };
  }

  /**
   * 整合商品实体
   * 需要将第3方商品信息,转换成标准的仓库信息
   * 再添加一些仓库信息
   */
  combineStoreEntity(thirdGoodsItem = {}, storeItem) {
    // 遍历标准实体映射
    // 将第3方字段转存过来
    const { modelMap } = this;
    const entity = {};
    Object.entries(modelMap).forEach(([standardKey, thirdKey]) => {
      entity[standardKey] = thirdGoodsItem[thirdKey];
    });
    entity.storeCode = storeItem.storeCode;
    entity.storeName = storeItem.storeName;
    entity.thirdObj = thirdGoodsItem;
    entity._id = md5(`${this.spId}-${entity.storeCode}-${entity.goodsCode}`);
    entity.spId = this.spId;
    entity.sort = 0;
    entity.updateTime = Date.now();
    uniCloud.logger.log("合并商品实体数据-出参", entity);
    return entity;
  }
  /**
   * 添加单个商品
   * @param entity
   * @param storeItem
   * @returns {Promise<{id: string}|{inserted: number, ids: string[]}>}
   */
  async add(entity, storeItem) {
    entity.expressName = storeItem.expressName;
    entity.expressCode = storeItem.expressCode;
    entity.createTime = Date.now();
    entity.isDeleted = false;
    entity.isEnable = true;
    const res = await colSpGoods.add(entity);
    uniCloud.logger.info("添加商品-出参", res);
    return res;
  }
  /**
   * 删除全部商品
   * @returns {Promise<{deleted: number}>}
   */
  async removeAll() {
    const res = await colSpGoods.where({ _id: dbCmd.exists(true) }).remove();
    uniCloud.logger.info("删除全部商品-出参", res);
    return res;
  }
  /**
   * 修改单个商品
   * @param id
   * @param entity
   * @returns {Promise<void>}
   */
  async update(id, entity) {
    uniCloud.logger.info("更新商品-入参", id, entity);
    const res = await colSpGoods.doc(id).update(entity);
    uniCloud.logger.info("更新商品-出参", res);
    return res;
  }
  /**
   * 查询单个商品
   * @param entity
   * @param storeCode
   * @returns {Promise<any>}
   */
  async get(entity, storeCode) {
    const condition = this.getWhereParam(entity, storeCode);
    uniCloud.logger.info("查询商品-入参", condition);
    const res = await colSpGoods.where(condition).get();
    uniCloud.logger.info("查询商品-出参", res);
    return res.data[0];
  }
  /**
   * 同步商品信息
   * @returns {Promise<void>}
   */
  async syncInfo(requestBody, storeItem) {
    uniCloud.logger.info("同步商品信息-入参", requestBody, storeItem);
    const { storeCode } = storeItem;
    // 从第3方查询商品列表
    // 遍历查询本地数据
    // 如果有对应的商品则更新,否则新增
    const newGoodsList = await this.getGoodsListFromApi(requestBody);
    for (let newGoodsItem of newGoodsList) {
      const entity = this.combineStoreEntity(newGoodsItem, storeItem);
      const oldGoods = await this.get(entity, storeCode);
      oldGoods
        ? await this.update(oldGoods._id, entity)
        : await this.add(entity, storeItem);
    }
  }
};
