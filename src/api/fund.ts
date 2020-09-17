import { Request } from "./request";

const requestAddress = new Request("customer");
class Fund {
  /**
   * 确认订单
   */
  getUserBalance(data: order.IConfirmReq) {
    return requestAddress.start<{ id: string }>({
      data,
      action: "customer-order/add",
    });
  }
}

export const fund = new Fund();
