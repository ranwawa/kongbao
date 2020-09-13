"use strict";
const Store = require("./store");
const Goods = require("./goods");
const { colCsOrder } = require("./db");
const ModelMap = require("./model-map");
const instanceMap = {
  store: Store,
  goods: Goods,
};
/**
 * 定时任务
 * 同步仓库,商品数据
 */
async function clockedTask() {
  const modelMap = new ModelMap();
  // 获取所有可更新的仓库映射
  // 遍历调用更新仓库接口
  // 遍历调用更新商品接口
  const storeModelMapList = await modelMap.getList({ type: "store" });
  for (let storeModelMapItem of storeModelMapList) {
    const Cstr = instanceMap[storeModelMapItem.type];
    if (!Cstr) {
      uniCloud.logger.info("没有映射类型对应的构造器", storeModelMapItem);
    } else {
      const { spId, apiUrl, map, spList } = storeModelMapItem;
      const { accessToken } = spList[0] || {};
      const instance = new Cstr(spId, accessToken, map);
      // 订阅更新商品信息的事件
      const goodsModelMapList = await modelMap.getList({ type: "goods", spId });
      const [goodsModelMapItem] = goodsModelMapList;
      const goods = new Goods(spId, accessToken, goodsModelMapItem.map);
      instance.addSubscriber("syncGoodsInfo", async (storeItem) => {
        goods.syncInfo(
          {
            url: goodsModelMapItem.apiUrl,
            method: "POST",
            data: {
              accessToken,
              storehouseCode: storeItem.storeCode,
            },
          },
          storeItem
        );
      });
      await instance.syncInfo({
        url: apiUrl,
        method: "POST",
        data: { accessToken },
      });
    }
  }
}
exports.main = async (event, context) => {
  const { action, data, path, body } = event;
  const { APPID } = context;
  // 批量下单回调
  if (path === "/cb/alihuocang") {
    uniCloud.logger.log("阿里货仓回调-入参", body);
    const newBody = JSON.parse(decodeURIComponent(body).split("=")[1] || []);
    if (!Array.isArray(newBody) || newBody.length < 1) {
      return;
    }
    console.log(newBody);
    const res = await colCsOrder
      .where({
        batchNo: newBody[0].batchNo,
      })
      .field({ addressInfo: true })
      .get();
    uniCloud.logger.log("阿里货仓回调,查询订单-出参", res);
    if (res.data.length < 1) {
      return;
    }
    const { _id, addressInfo } = res.data[0];
    const addressInfoNew = addressInfo.map((ele) => {
      const addressItem = newBody.find(
        (item) => item.thirdOrderNo === ele.addressId
      );
      return {
        ...ele,
        recordId: addressItem.recordId,
        spAmount: addressItem.amount,
      };
    });
    const res2 = await colCsOrder.doc(_id).update({
      addressInfo: addressInfoNew,
    });
    uniCloud.logger.log("阿里货仓回调,查询订单-出参", res2);
    return;
  }
  // const goods = new Goods();
  // const store = new Store();
  // await store.removeAll();
  // await goods.removeAll();
  // await clockedTask();
  if (action) {
    const [model, method] = action.split("/");
    let instance = new instanceMap[model]();
    return instance[method]
      ? await instance[method](data, event, context)
      : {
          code: 404,
          msg: "未找到访问的接口",
        };
  } else {
    return event;
  }
};
