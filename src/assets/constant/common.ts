export enum ROUTE {
  "USER_REGISTER" = "/pages/user/register",
  "USER_LOGIN_HOME" = "/pages/user/login-home",
  "GOODS_DETAIL" = "/pages/goods/detail",
  "ORDER_INDEX" = "/pages/order/index",
  "ORDER_PAY" = "/pages/order/pay",
  "ORDER_DETAIL" = "/pages/order/detail",
  "ORDER_LIST" = "/pages/order/list",
  "TAB_CATEGORY" = "/pages/tab/goods-category",
  "TAB_HOME" = "/pages/tab/home",
  "ADDRESS_LIST" = "/pages/address/list",
  "FUND_BALANCE" = "/pages/fund/balance",
  "FUND_RECHARGE" = "/pages/fund/recharge",
}

export const STORAGE_KEY = {
  UNI_ID_TOKEN: "uni_id_token",
  USER_INFO: "user_info",
};

/**
 * 支付类型
 */
export enum PAY_TYPE {
  "ALIPAY" = 1,
  "WECHAT",
}
