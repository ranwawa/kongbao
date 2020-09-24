const { callFunc, apiALHC, ControllerBase, config, utils } = require("api");
const BACK_END = "controller-backend";
const { md5, yuan2fen, lodash } = utils;
const { spId } = config.alhc;
module.exports = class AliHuoCang {
  /**
   * 同步仓库
   */
  async syncStore() {
    // 获取仓库信息
    const newStoreList = await this.getStoreList();
    // 更新仓库信息
    for (let newStoreItem of newStoreList) {
      // 查询仓库
      // 如果木有则新增,并追加纪录
      // 判断快递金额是否有变化.如果有变化则更新,并追加纪录
      const storeId = md5(`${spId}-${newStoreItem.code}`);
      const [err, data] = await this.getStoreSingle(storeId);
      if (err || !data) {
        continue;
      }
      data._id
        ? this.updateStore(newStoreItem, data)
        : this.addStore(newStoreItem, storeId);
      // 更新商品信息
      this.syncGoods(newStoreItem.code, storeId);
    }
  }
  /**
   * 同步商品信息
   */
  async syncGoods(storeCode, storeId) {
    const goodsList = await this.getGoodsList(storeCode);
    for (let newGoodsItem of goodsList) {
      const goodsId = md5(`${storeId}-${newGoodsItem.code}`);
      const oldGoods = await this.getGoodsSingle(goodsId);
      if (oldGoods._id) {
        this.updateGoods(newGoodsItem, oldGoods);
      } else {
        this.addGoods(newGoodsItem, goodsId, storeId);
      }
    }
  }
  /**
   * 查询单条仓库信息
   */
  async getStoreSingle(storeId) {
    // uniCloud.logger.info('(alihuocang-async)查询单条仓库信息-入参', storeId);
    const res = await callFunc({
      name: BACK_END,
      action: "supplier-store/getSingleById",
      data: { storeId },
    });
    // uniCloud.logger.info('(alihuocang-async)查询单条仓库信息-出参', res);
    return res;
  }
  /**
   * 添加一条仓库信息
   */
  async addStore(newStoreItem, storeId) {
    uniCloud.logger.info(
      "(alihuocang-async)添加一条仓库信息-入参",
      newStoreItem
    );
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-store/add",
      data: {
        spId,
        _id: storeId,
        updateTime: Date.now(),
        createTime: Date.now(),
        isDeleted: false,
        isEnable: true,
        sort: 0,
        storeName: newStoreItem.name,
        formattedAddress: newStoreItem.shipAddress,
        remark: newStoreItem.notSendAddress,
        originInfo: newStoreItem,
        expressList: [
          {
            expressId: "",
            expressCostPrice: yuan2fen(newStoreItem.expressCostPrice),
          },
        ],
      },
    });
    if (err) {
      uniCloud.logger.error("(alihuocang-async)添加一条仓库信息", err);
      return;
    }
    uniCloud.logger.info("(alihuocang-async)添加一条仓库信息-出参", data);
    await this.addLog("新增一条仓库", `仓库id是${storeId}`);
    return data;
  }
  /**
   * 更新仓库
   */
  async updateStore(storeInfoNew, storeInfoOld) {
    // 只有价格发生变化后才会更新
    // 更新也只更新时间,价格
    if (
      storeInfoNew.expressCostPrice === storeInfoOld.originInfo.expressCostPrice
    ) {
      return;
    }
    // uniCloud.logger.info( '(alihuocang-async)更新仓库-入参', storeInfoNew, storeInfoOld);
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-store/update",
      data: {
        storeId: storeInfoOld._id,
        updateTime: Date.now(),
        expressList: [
          {
            expressId: "",
            expressCostPrice: yuan2fen(storeInfoNew.expressCostPrice),
          },
        ],
      },
    });
    if (err) {
      uniCloud.logger.error("(alihuocang-async)更新仓库出错", err);
      return;
    }
    uniCloud.logger.info("(alihuocang-async)更新仓库-出参", data);
    this.addLog(
      "更新仓库",
      `仓库id是${storeInfoOld._id},老的价格是${storeInfoOld.originInfo.expressCostPrice}
    ,新的价格是${storeInfoNew.expressCostPrice}`
    );
    return data;
  }
  /**
   * 添加一条日志
   */
  async addLog(title, content) {
    uniCloud.logger.info("(alihuocang-async)添加一条日志-入参", title, content);
    const res = await callFunc({
      name: BACK_END,
      action: "platform-log/add",
      data: { title, content },
    });
    uniCloud.logger.info("(alihuocang-async)添加一条日志-出参", res);
    return res;
  }
  /**
   * 从第3方拉所有仓库信息
   */
  async getStoreList() {
    const [err, data] = await apiALHC.findStorehouseList();
    return err ? [] : data;
  }
  /**
   * 同步商品
   */
  async getGoodsList(storehouseCode) {
    // 根据仓库code查询所有第3方商品
    const [err, data] = await apiALHC.findStorehouseGoodsStockList({
      storehouseCode,
    });
    return err ? [] : data;
  }
  /**
   * 查询单条商品
   */
  async getGoodsSingle(goodsId) {
    uniCloud.logger.info("(alihuocang-async)查询单条商品-入参", goodsId);
    const res = await callFunc({
      name: BACK_END,
      action: "supplier-goods/getSingleById",
      data: { goodsId },
    });
    uniCloud.logger.info("(alihuocang-async)查询单条商品-出参", res);
    return res;
  }
  /**
   * 添加商品
   */
  async addGoods(newGoodsItem, goodsId, storeId) {
    const now = Date.now();
    const res = await callFunc({
      name: BACK_END,
      action: "supplier-goods/add",
      data: {
        spId,
        _id: goodsId,
        sort: 0,
        updateTime: now,
        createTime: now,
        isDelete: false,
        isEnable: true,
        goodsName: newGoodsItem.name,
        goodsCode: newGoodsItem.code,
        imgList: [newGoodsItem.image],
        sales: newGoodsItem.sales,
        inventory: newGoodsItem.totalStockNumber,
        content: newGoodsItem.intro,
        goodsCostPrice: yuan2fen(newGoodsItem.price),
        originInfo: newGoodsItem,
      },
    });
    uniCloud.logger.info("(alihuocang-async)添加商品-出参", res);
    const [err, data] = res;
    if (err) {
      uniCloud.logger.error("(alihuocang-async)添加商品失败", err);
      return;
    }
    this.addStoreGoodsRelation(storeId, goodsId);
    await this.addLog("添加商品", `商品id是${goodsId}`);
    return data;
  }
  /**
   * 更新商品
   */
  async updateGoods(newGoodsItem, oldGoodsItem) {}
  /**
   * 添加仓库和商品的关联信息
   */
  async addStoreGoodsRelation(storeId, goodsId) {
    await callFunc({
      name: BACK_END,
      action: "supplier-store-goods/add",
      data: { storeId, goodsId },
    });
  }
};
