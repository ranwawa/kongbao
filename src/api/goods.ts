import { Request } from "./request";

const request = new Request("controller-frontend");
class Goods {
  /**
   * 查询支持的城市列表
   */
  getCityList(data = {}) {
    return request.start<Array<city.IItem>>({
      data,
      action: "platform-cities/getList",
    });
  }
  /**
   * 根据城市ID查询商品列表
   */
  getGoodsList(data: goods.IGoodsListReq) {
    return request.start<Array<goods.IGoodsItem>>({
      data,
      action: "supplier-store/getGoodsListByCityId",
    });
  }

  /**
   * 根据商品ID查询商品信息
   * @param data
   */
  getGoodsDetail(data: { goodsId: string }) {
    return request.start<goods.IGoodsItem>({
      data,
      action: "agent-goods/getSingleByGoodsId",
    });
  }
  /**
   * 查询推荐商品
   */
  getGoodsRecommend() {
    return request.start<Array<goods.IGoodsItem>>({
      data: {},
      action: "agent-goods/getListRecommend",
    });
  }
}

export const goods = new Goods();
