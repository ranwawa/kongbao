/**
 * @file 代理分站相关接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 14:56
 */
import { Request } from "./request";

const requestAddress = new Request("controller-frontend");

class Agent {
  /**
   * 添加支付二维码
   */
  async addQrCode(data: { payType: number, money: number, src: string }) {
    return requestAddress.start<{ id: string }>({
      data,
      action: "agent-info/addQrCode",
    });
  }
  /**
   * 根据appId查询代理分站信息
   */
  async getSingleByAppId(data = {}) {
    return requestAddress.start<admin.IAgentInfo>({
      data,
      action: "agent-info/getSingleByAppId",
    });
  }
  /**
   * 删除一张二维码
   */
  async removeQr(data: { payType: number, money: number}) {
    return requestAddress.start<any>({
      data,
      action: "agent-info/removeQr",
    });
  }
}

export const agent = new Agent();
