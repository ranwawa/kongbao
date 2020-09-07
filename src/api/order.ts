import { Request } from "./request";

const requestAddress = new Request("customer");
class Order {
  /**
   * 确认订单
   */
  add(data: order.IConfirmReq) {
    return requestAddress.start<object, { id: string }>({
      data,
      action: "customer-order/add",
    });
  }

  /**
   * 支付订单
   * @param data
   */
  pay(data: { orderId: string; payType: number }) {
    return requestAddress.start<object, { _id: string }>({
      data,
      action: "customer-order/add",
    });
  }

  /**
   * 查询订单详情
   * @param data
   */
  getSingle(data: { orderId: string }) {
    return requestAddress.start<object, { _id: string }>({
      data,
      action: "customer-order/getSingle",
    });
  }
}

export const order = new Order();
