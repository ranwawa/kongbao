import { Request } from "./request";

const request = new Request("controller-frontend");
class Order {
  /**
   * 确认订单
   */
  add(data: order.IConfirmReq) {
    return request.start<{ id: string }>({
      data,
      action: "customer-order/add",
    });
  }

  /**
   * 支付订单
   * @param data
   */
  pay(data: { orderId: string; payType?: number }) {
    return request.start<{ _id: string }>({
      data,
      action: "customer-order/pay",
    });
  }

  /**
   * 查询订单详情
   * @param data
   */
  getSingle<T = { orderId: string }>(data: T) {
    return request.start<order.IDetailRes>({
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
