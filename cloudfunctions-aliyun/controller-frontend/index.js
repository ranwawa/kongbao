/**
 * @file 前端相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:55
 */
const { mainFunc } = require("api");
const PlatformCities = require("./platform-cities");
const SupplierStore = require("./supplier-store");
const AgentInfo = require("./agent-info");
const AgentGoods = require("./agent-goods");
const CustomerService = require("./customer-service");
const CustomerOrder = require("./customer-order");
const CustomerFund = require("./customer-fund");
const CustomerFundOrder = require("./customer-fund-order");
const CustomerVip = require("./customer-vip");
const UserAuth = require("./user-auth");
const UserAnonymous = require("./user-anonymous");
const OrderOperate = require("./order-operate");

const fileMap = {
  "platform-cities": PlatformCities,
  "supplier-store": SupplierStore,
  "agent-info": AgentInfo,
  "agent-goods": AgentGoods,
  "customer-fund": CustomerFund,
  "customer-service": CustomerService,
  "customer-order": CustomerOrder,
  "user-auth": UserAuth,
  "user-anonymous": UserAnonymous,
  "order-operate": OrderOperate,
  "customer-fund-order": CustomerFundOrder,
  "customer-vip": CustomerVip,
};
exports.main = async (event, context) => {
  // todo 上线时删掉这个
  context.CLIENTUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";

  return await mainFunc(event, context, fileMap);
};
