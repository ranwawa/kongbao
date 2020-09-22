import { Request } from "./request";

const requestAddress = new Request("controller-frontend");
class Vip {
  /**
   * 根据类型获取资金明细列表
   */
  getList(data = {}) {
    return requestAddress.start<Array<vip.IItem>>({
      data,
      action: "customer-vip/getList",
    });
  }
}

export const vipApi = new Vip();
