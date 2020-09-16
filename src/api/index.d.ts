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
  interface LoginRes extends RegisterRes {
  }

  /**
   * 用户信息响应
   */
  interface IUserInfoRes {
    nickname: string;
    balance: number;
    isVip: boolean;
  }
}

namespace store {
  /**
   * 仓库模型
   */
  interface IStoreItem {
    storeName: string;
    storeCode: string;
    goodsList?: any[];
  }
}

namespace goods {
  interface IGoodsListReq {
    storeCode: string;
    pageSize: number;
    currentPage: number;
  }

  /**
   * 商品响应体
   */
  interface IGoodsItem {
    goodsId: string;
    showPrice: number;
    showPriceStr: number;
    salePriceVip: number;
    salePriceVipStr: number;
    salePriceNormal: number;
    salePriceNormalStr: number;
    goodsName: string;
    imgList: Array<string>;
    sales: number;
    inventory: number;
    content: string;
    storeName: string;
    expressName: string;
    shipAddress: string;
    notSendAddress: string;
  }
}

namespace service {
  interface IItem {
    phone: string;
    name: string;
  }
}

namespace address {
  /**
   * 单条地址
   */
  interface IAddressItem {
    addressId: string;
    name: string;
    mobile: string;
    provinceName: string;
    cityName: string;
    areaName: string;
    address: string;
    formattedAddress: string;
    default: boolean;
  }
}

namespace order {
  /**
   * 确认订单请求参数
   */
  interface IConfirmReq {
    /**
     * 商品信息
     */
    goodsInfo: goods.IGoodsItem;
    /**
     * 售后信息
     */
    serviceInfo: address.IAddressItem;
    /**
     * 收货地址
     */
    addressInfo: Array<address.IAddressItem>;
  }

  /**
   * 商品详情响应数据
   */
  interface IDetailRes {
    /**
     * 售后信息
     */
    serviceInfo: string;
    /**
     * 收货地址
     */
    addressInfo: Array<{ formattedAddress: string }>;
    /**
     * 商品信息
     */
    goodsInfo: object;
    /**
     * 订单总金额
     */
    amount: number;
    orderId: string;
    createTime: string;
    payTime: string;
    storeTime: string;
  }

  /**
   * 订单选项
   */
  interface ITabItem {
    name: string;
    /**
     * 订单状态
     * -1所有订单
     * 1已创建,待支付
     * 2已支付,待提交到供应商
     * 3已提交到供应,待供应商响应(待收货)
     * 4已收货,待发货(出物流纪录)
     */
    status: number;
  }
}
