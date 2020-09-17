import { Request } from "./request";

const request = new Request("controller-frontend");
class Goods {
  /**
   * 查询仓库列表
   * @param data
   */
  getStoreList(data = {}) {
    return request.start<Array<store.IStoreItem>>({
      data,
      action: "supplier-store/getList",
    });
  }

  /**
   * 根据仓库ID查询商品列表
   * @param data
   */
  getGoodsList(data: goods.IGoodsListReq) {
    return request.start<Array<goods.IGoodsItem>>({
      data,
      action: "agent-goods/getListByStoreCode",
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
   * @param data
   */
  getGoodsRecommend() {
    return request.start<Array<goods.IGoodsItem>>({
      data: {},
      action: "agent-goods/getListRecommend",
    });
  }
}

export const goods = new Goods();
