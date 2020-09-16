import { Request } from "./request";

const request = new Request("controller-frontend");
class Address {
  /**
   * 添加一条地址
   */
  add(data: address.IAddressItem) {
    return request.start<{ _id: string }>({
      data,
      action: "customer-address/add",
    });
  }
  /**
   * 删除一条地址
   */
  del(data: { addressId: string }) {
    return request.start<Array<address.IAddressItem>>({
      data,
      action: "customer-address/del",
    });
  }
  /**
   * 设置默认地址
   */
  setDefault(data: { addressId: string }) {
    return request.start<Array<address.IAddressItem>>({
      data,
      action: "customer-address/setDefault",
    });
  }
  /**
   * 修改一条地址
   */
  update(data: address.IAddressItem) {
    return request.start<{ _id: string }>({
      data,
      action: "customer-address/update",
    });
  }
  /**
   * 查询服务地址列表
   * @param data
   */
  getAddressList(data = {}) {
    return request.start<Array<address.IAddressItem>>({
      data,
      action: "customer-address/getList",
    });
  }
  /**
   * 查询默认地址
   * @param data
   */
  getAddressDefault(data = {}) {
    return request.start<address.IAddressItem>({
      data,
      action: "customer-address/getDefault",
    });
  }
  /**
   * 解析地址
   */
  resolveAddress<T = { addressStr: "" }>(data: T) {
    return request.start<Array<address.IAddressItem>>({
      data,
      action: "customer-address/resolveAddress",
    });
  }
}

export const address = new Address();
