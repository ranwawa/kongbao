const { callFunc, apiALHC, ControllerBase, config, utils } = require("api");
const BACK_END = "controller-backend";
const { md5, yuan2fen, lodash } = utils;
const { spId } = config.alhc;
module.exports = class AliHuoCang extends ControllerBase {
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
      const storeItemOld = await this.getStoreSingle(storeId);
      storeItemOld._id
        ? this.updateStore(newStoreItem, storeItemOld)
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
      const goodsItemOld = await this.getGoodsSingle(goodsId);
      if (goodsItemOld._id) {
        this.updateGoods(newGoodsItem, goodsItemOld.originInfo, goodsId);
      } else {
        this.addGoods(newGoodsItem, goodsId, storeId);
      }
    }
  }
  /**
   * 查询单条仓库信息
   */
  async getStoreSingle(storeId) {
    this.info("(alihuocang-async)查询单条仓库信息-入参", storeId);
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-store/getSingleById",
      data: { storeId },
    });
    this.info("(alihuocang-async)查询单条仓库信息-出参", [err, data]);
    return data;
  }
  /**
   * 添加一条仓库信息
   */
  async addStore(storeInfoNew, storeId) {
    this.info("(alihuocang-async)添加一条仓库信息-入参", storeInfoNew);
    const param = {
      spId,
      _id: storeId,
      storeName: storeInfoNew.name,
      formattedAddress: storeInfoNew.shipAddress,
      remark: "暂不发货区域：" + storeInfoNew.notSendAddress,
      cityInfo: {
        cityId: "",
        cityName: "",
      },
      expressInfo: {
        expressCostPrice: yuan2fen(storeInfoNew.expressCostPrice),
        expressName: "",
        expressLogo: "",
        expressId: "",
      },
      originInfo: storeInfoNew,
      ...this.getBaseFields(),
    };
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-store/add",
      data: param,
    });
    if (err) {
      uniCloud.logger.error("(alihuocang-async)添加一条仓库信息", err);
      return;
    }
    this.info("(alihuocang-async)添加一条仓库信息-出参", data);
    return data;
  }
  /**
   * 更新仓库
   */
  async updateStore(storeInfoNew, storeInfoOld) {
    // 只有价格发生变化后才会更新
    // 更新也只更新时间,价格
    const newPrice = storeInfoNew.expressCostPrice;
    const oldPrice = storeInfoOld.originInfo.expressCostPrice;
    if (newPrice === oldPrice) {
      return;
    }
    this.info("(alihuocang-async)更新仓库-入参", newPrice, oldPrice);
    const param = {
      storeId: storeInfoOld._id,
      updateTime: Date.now(),
      expressInfo: {
        expressCostPrice: yuan2fen(storeInfoNew.expressCostPrice),
      },
      originInfo: storeInfoNew,
    };
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-store/update",
      data: param,
    });
    if (err) {
      uniCloud.logger.error("(alihuocang-async)更新仓库出错", err);
      return;
    }
    this.info("(alihuocang-async)更新仓库-出参", data);
    this.addLog("更新仓库", { storeInfoNew, storeInfoOld });
    return data;
  }
  /**
   * 添加一条日志
   */
  async addLog(title, content) {
    this.info("(alihuocang-async)添加日志-入参", title);
    const res = await callFunc({
      name: BACK_END,
      action: "platform-log/add",
      data: { title, content },
    });
    this.info("(alihuocang-async)添加日志-出参", res);
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
   * 根据仓库code查询所有第3方商品
   */
  async getGoodsList(storehouseCode) {
    const [err, data] = await apiALHC.findStorehouseGoodsStockList({
      storehouseCode,
    });
    return err ? [] : data;
  }
  /**
   * 查询单条商品
   */
  async getGoodsSingle(goodsId) {
    this.info("(alihuocang-async)查询单条商品-入参", goodsId);
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-goods/getSingleById",
      data: { goodsId },
    });
    this.info("(alihuocang-async)查询单条商品-出参", [err, data]);
    return data;
  }
  /**
   * 添加商品
   */
  async addGoods(goodsItemNew, goodsId, storeId) {
    const param = {
      _id: goodsId,
      spId,
      storeId,
      goodsName: goodsItemNew.name,
      goodsCode: goodsItemNew.code,
      ...this.getGoodsPrice(goodsItemNew.price),
      sales: goodsItemNew.sales,
      inventory: goodsItemNew.totalStockNumber,
      content: goodsItemNew.intro,
      imgList: [goodsItemNew.image],
      originInfo: goodsItemNew,
      ...this.getBaseFields(),
    };
    const res = await callFunc({
      name: BACK_END,
      action: "supplier-goods/add",
      data: param,
    });
    this.info("(alihuocang-async)添加商品-出参", res);
    const [err, data] = res;
    if (err) {
      uniCloud.logger.error("(alihuocang-async)添加商品失败", err);
      return;
    }
    return data;
  }
  getGoodsPrice(priceStr) {
    const price = yuan2fen(priceStr);
    return {
      goodsCostPrice: price,
      agentPriceNormal: price + 10, // 普通代理赚一毛
      agentPriceVip: price + 5, // 高级代理赚5分
    };
  }
  /**
   * 更新商品
   */
  async updateGoods(goodsItemNew, goodsItemOld, goodsId) {
    // 只有价格或者库存变了,才更新
    const { totalStockNumber, price } = goodsItemNew;
    const oldTotalStockNumber = goodsItemOld.totalStockNumber;
    const oldPrice = goodsItemOld.price;
    this.info("(alihuocang-async)修改商品-入参", price, oldPrice);
    if (totalStockNumber === oldTotalStockNumber && price === oldPrice) {
      return;
    }
    let priceParam = price !== oldPrice ? this.getGoodsPrice(price) : {};
    const param = {
      goodsId,
      inventory: totalStockNumber,
      originInfo: goodsItemNew,
      ...priceParam,
    };
    const [err, data] = await callFunc({
      name: BACK_END,
      action: "supplier-goods/update",
      data: param,
    });
    if (err) {
      uniCloud.logger.error("(alihuocang-async)修改商品出错", err);
      return;
    }
    this.info("(alihuocang-async)修改商品-出参", data);
    this.addLog("更新商品", { goodsItemNew, goodsItemOld });
    return data;
  }
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
