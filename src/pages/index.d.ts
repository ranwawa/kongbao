/**
 * @file 页面相关模型
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 10:33
 */

namespace admin {

  type payType = 'wechat' | 'alipay';

  /**
   * 分站二维码tab
   */
  interface IAgentQrTab {
    name: string;
    type: payType;
  }

  /**
   * 二维码信息
   */
  interface IQrItem {
    money: number | string;
    src: string;
    imgType: string;
    tabType: payType;
    /**
     * 是否正在编辑该二维码的价格
     */
    isEditMoney?: boolean;
  }

  interface IAgentInfo {
    qr: {
      /**
       * 微信二维码信息
       */
      'wechat': Array<IQrItem>,
      /**
       * 支付宝二维码信息
       */
      'alipay': Array<IQrItem>,
    }
  }
}
