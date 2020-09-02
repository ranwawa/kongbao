/* uniCloud类型 */
import DatabaseAggregateCommand = DB.DatabaseAggregateCommand;

namespace user {
  /**
   * 注册请求参数
   */
  interface RegisterReq {
    /**
     * 用户名，唯一
     */
    username: string;
    /**
     * 密码
     */
    password: string;
    /**
     * 自行设置用户的邀请码
     */
    myInviteCode?: string;
  }

  /**
   * 注册响应参数
   */
  interface RegisterRes extends TypesUniCloud.DataBaseRes {
    /**
     * 用户ID
     */
    uid: string;
    /**
     * 用户名
     */
    username: string;
    /**
     * token令牌
     */
    token: string;
    /**
     * token过期时间
     */
    tokenExpired: number;
  }

  /**
   * 登录请求参数
   */
  interface LoginReq {
    username: string;
    password: string;
  }

  /**
   * 登录响应参数
   */
  interface LoginRes extends RegisterRes {}
}

namespace store {
  /**
   * 仓库列表响应体
   */
  interface StoreListRes extends TypesUniCloud.DataListRes<StoreItem> {}

  /**
   * 仓库模型
   */
  interface StoreItem {
    storeName: string;
    storeCode: string;
    goodsList?: any[];
  }
}

namespace goods {
  import DataListRes = TypesUniCloud.DataListRes;

  interface IGoodsListRes extends DataListRes<IGoodsItem> {}
  /**
   * 商品响应体
   */
  interface IGoodsItem {
    _id: string;
    showPrice: string;
    salePriceVip: number;
    salePriceNormal: number;
    goodsName: string;
    imgList: Array<string>;
    sales: number;
    inventory: number;
    content: string;
    storeName: string;
    expressName: string;
  }
}
