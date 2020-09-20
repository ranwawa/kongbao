import { Request } from "./request";

const requestAddress = new Request("controller-frontend");
class Fund {
  /**
   * 根据类型获取资金明细列表
   */
  getListByType(data: order.IConfirmReq) {
    return requestAddress.start<{ id: string }>({
      data,
      action: "customer-fund-order/getListByType",
    });
  }
}

export const fund = new Fund();
