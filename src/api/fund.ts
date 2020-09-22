import { Request } from "./request";

const requestAddress = new Request("controller-frontend");
class Fund {
  /**
   * 根据类型获取资金明细列表
   */
  getListByType(data: fund.IGetListReq) {
    return requestAddress.start<Array<fund.IFundItem>>({
      data,
      action: "customer-fund/getListByIsIncome",
    });
  }
}

export const fund = new Fund();
