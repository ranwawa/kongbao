import { Request } from "./request";

const requestAgent = new Request("agent");
const requestStore = new Request("api-express");
class Goods {
  getStoreList(data = {}) {
    return requestStore.start<object, store.StoreListRes>({
      data,
      action: "store/getList",
    });
  }
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
}

export const goods = new Goods();
