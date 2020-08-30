import { Request } from "./request";

const request = new Request("api-express");
const requestStart = request.start.bind(request);
class Goods {
  getStoreList(data = {}) {
    return requestStart<object, store.StoreListRes>({
      data,
      action: "store/getList",
    });
  }
  getGoodsList(data: { storeCode: string }) {
    return requestStart<{ storeCode: string }, store.GoodsListRes>({
      data,
      action: "goods/getList",
    });
  }
}

export const goods = new Goods();
