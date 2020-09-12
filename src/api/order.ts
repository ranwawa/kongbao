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
  pay(data: { orderId: string; payType?: number }) {
    return requestAddress.start<object, { _id: string }>({
      data,
      action: "customer-order/pay",
    });
  }

  /**
   * 查询订单详情
   * @param data
   */
  getSingle<T = { orderId: string }>(data: T) {
    return requestAddress.start<T, order.IDetailRes>({
      data,
      action: "customer-order/getSingle",
    });
  }
  /**
   * 查询订单列表
   * @param data
   */
  getList<T = { status: number }>(data: T) {
    return requestAddress.start<T, Array<order.IDetailRes>>({
      data,
      action: "customer-order/getList",
    });
  }
}

export const order = new Order();
