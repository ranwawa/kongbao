import { Request } from "./request";

const requestAgent = new Request("agent");
const requestStore = new Request("api-express");
class Goods {
  /**
   * 查询仓库列表
   * @param data
   */
  getStoreList(data = {}) {
    return requestStore.start<object, store.StoreListRes>({
      data,
      action: "store/getList",
    });
  }

  /**
   * 根据仓库ID查询商品列表
   * @param data
   */
  getGoodsList(data: {
    storeCode: string;
    pageSize: number;
    currentPage: number;
  }) {
    return requestAgent.start<{ storeCode: string }, goods.IGoodsListRes>({
      data,
      action: "agent-goods/getList",
    });
  }

  /**
   * 根据商品ID查询商品信息
   * @param data
   */
  getGoodsDetail(data: { goodsId: string }) {
    return requestAgent.start<{ goodsId: string }, goods.IGoodsItem>({
      data,
      action: "agent-goods/get",
    });
  }
}

export const goods = new Goods();
