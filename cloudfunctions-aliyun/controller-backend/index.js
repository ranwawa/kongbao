/**
 * @file 后端相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 11:55
 */
const { mainFunc } = require("api");
const PlLog = require("./platform-log");
const PlExpress = require("./platform-express");
const SpInfo = require("./supplier-info");
const SpGoods = require("./supplier-goods");
const SpStore = require("./supplier-store");
const SpStoreGoods = require("./supplier-store-goods");
const AgentInfo = require("./agent-info");
const AgentService = require("./customer-service");
const AgentFund = require("./agent-fund");
const AgentGoods = require("./agent-goods");
const CustomerOrder = require("./customer-order");
const CustomerFund = require("./customer-fund");
const CustomerFundOrder = require("./customer-fund-order");
const UserAnonymous = require("./user-anonymous");
const GoodsOperate = require("./goods-operate");
const fileMap = {
  "platform-log": PlLog,
  "platform-express": PlExpress,
  "supplier-info": SpInfo,
  "supplier-goods": SpGoods,
  "supplier-store": SpStore,
  "supplier-store-goods": SpStoreGoods,
  "agent-goods": AgentGoods,
  "agent-info": AgentInfo,
  "agent-fund": AgentFund,
  "customer-order": CustomerOrder,
  "customer-fund": CustomerFund,
  "customer-fund-order": CustomerFundOrder,
  "user-anonymous": UserAnonymous,
  "goods-operate": GoodsOperate,
};
exports.main = async (event, context) => {
  // todo 上线时删掉这个
  context.CLIENTUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
  if (event.action === "removeAll") {
    await new PlLog().removeAll();
    await new SpGoods().removeAll();
    await new SpStore().removeAll();
    await new SpStoreGoods().removeAll();
    await new AgentGoods().removeAll();
    await new AgentService().removeAll();
    await new AgentFund().removeAll();
    await new CustomerOrder().removeAll();
    await new CustomerFund().removeAll();
    await new CustomerFundOrder().removeAll();
  }
  return await mainFunc(event, context, fileMap);
};
