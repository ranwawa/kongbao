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
      ],
    ];
    // return res;
  },
  // 按仓库获取库存数据
  findStorehouseGoodsStockList: async (data) => {
    uniCloud.logger.info("(api-alhc)仓库获取库存数据-入参", data);
    // const res = await request({
    //   data: {
    //     ...data,
    //     accessToken: alhc.accessToken,
    //   },
    //   url: `${alhc.baseUrl}api/goods/findStorehouseGoodsStockList`,
    // });
    // uniCloud.logger.info("(api-alhc)按仓库获取库存数据-出参", res);
    // return res;
    return [
      null,
      [
        {
          code: "00003",
          name: "小老鼠剥橙器橙子剥皮器剥橙器",
          price: "3.35",
          weight: 0.01,
          totalStockNumber: 42191,
          specification: "",
          image:
            "http://www.alihuocang.com/alixiaocangvf/20181220/4d666ec9277c4e2ba4d8210eb13de892.png",
          intro: "",
          sales: 302956,
          brand: "",
          unit: "",
        },
      ],
    ];
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
