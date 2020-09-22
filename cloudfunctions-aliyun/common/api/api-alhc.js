const { request } = require("./request");
const baseUrl = "http://www.alihuocang.com/";
module.exports = {
  // 快递运单号批量查询接口
  findExpressNoList: async (data) => {
    uniCloud.logger.info("快递运单号批量查询(api)-入参", data);
    const res = await request({
      data,
      url: `${baseUrl}OpenPlatform/findExpressNoList`,
    });
    uniCloud.logger.info("快递运单号批量查询(api)-出参", res);
    return res;
  },
  // 获取仓库列表
  findStorehouseList: async (data) => {
    uniCloud.logger.info("获取仓库列表(api)-入参", data);
    const res = await request({
      data,
      url: `${baseUrl}api/storehouse/list`,
    });
    uniCloud.logger.info("获取仓库列表(api)-出参", res);
    return res;
  },
  // 按仓库获取库存数据
  findStorehouseGoodsStockList: async (data) => {
    uniCloud.logger.info("按仓库获取库存数据(api)-入参", data);
    const res = await request({
      data,
      url: `${baseUrl}api/goods/findStorehouseGoodsStockList`,
    });
    uniCloud.logger.info("按仓库获取库存数据(api)-出参", res);
    return res;
  },
  // 批量下单
  merchantCreateOrderList: async (data) => {
    uniCloud.logger.info("(api-alihc)批量下单-入参", data);
    const res = await request({
      data,
      url: `${baseUrl}api/createOrder/merchantCreateOrderList`,
    });
    uniCloud.logger.info("(api-alihc)批量下单-出参", res);
    return res;
  },
};
