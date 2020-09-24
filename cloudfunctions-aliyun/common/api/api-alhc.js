const { request } = require("./request");
const { alhc } = require("./config");
module.exports = {
  // 快递运单号批量查询接口
  findExpressNoList: async (data) => {
    uniCloud.logger.info("(api-alhc)快递运单号批量查询-入参", data);
    const res = await request({
      data: {
        ...data,
        accessToken: alhc.accessToken,
      },
      url: `${alhc.baseUrl}OpenPlatform/findExpressNoList`,
    });
    uniCloud.logger.info("(api-alhc)快递运单号批量查询-出参", res);
    return res;
  },
  // 获取仓库列表
  findStorehouseList: async (data) => {
    // uniCloud.logger.info("(api-alhc)获取仓库列表-入参", data);
    // const res = await request({
    //   data: {
    //     ...data,
    //     accessToken: alhc.accessToken,
    //   },
    //   url: `${alhc.baseUrl}api/storehouse/list`,
    // });
    // uniCloud.logger.info("(api-alhc)获取仓库列表-出参", res);
    return [
      null,
      [
        {
          name: "圆通北京仓",
          code: "00001",
          expressName: "圆通快递",
          provinceName: "北京市",
          cityName: "市辖区",
          areaName: "顺义区",
          shipAddress: "北京市市辖区顺义区南法信府前街16号",
          expressCostPrice: "3.9",
          notSendAddress: "新疆,西藏,宁夏,甘肃,内蒙古,香港,澳门,台湾",
        },
        {
          name: "邮政泉州仓",
          code: "00004",
          expressName: "邮政EMS",
          provinceName: "福建省",
          cityName: "泉州市",
          areaName: "惠安县",
          shipAddress: "福建省泉州市惠安县张青公路中熙产业园",
          expressCostPrice: "3",
          notSendAddress: "新疆,西藏,宁夏,甘肃,内蒙古,香港,澳门,台湾,河北",
        },
        {
          name: "圆通杭州仓",
          code: "00005",
          expressName: "圆通快递",
          provinceName: "浙江省",
          cityName: "绍兴市",
          areaName: "上虞市",
          shipAddress: "浙江省绍兴市上虞市张青公路中熙产业园",
          expressCostPrice: "3.1",
          notSendAddress: "新疆,西藏,宁夏,甘肃,内蒙古,香港,澳门,台湾",
        },
      ],
    ];
    // return res;
  },
  // 按仓库获取库存数据
  findStorehouseGoodsStockList: async (data) => {
    // uniCloud.logger.info("(api-alhc)仓库获取库存数据-入参", data);
    const res = await request({
      data: {
        ...data,
        accessToken: alhc.accessToken,
      },
      url: `${alhc.baseUrl}api/goods/findStorehouseGoodsStockList`,
    });
    // uniCloud.logger.info("(api-alhc)按仓库获取库存数据-出参", res);
    return res;
  },
  // 批量下单
  merchantCreateOrderList: async (data) => {
    uniCloud.logger.info("(api-alhc)批量下单-入参", data);
    const res = await request({
      data: {
        ...data,
        accessToken: alhc.accessToken,
      },
      url: `${alhc.baseUrl}api/createOrder/merchantCreateOrderList`,
    });
    uniCloud.logger.info("(api-alhc)批量下单-出参", res);
    return res;
  },
};
