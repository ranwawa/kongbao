import { Request } from "./request";

const requestAddress = new Request("customer");
class Address {
  /**
   * 添加一条地址
   */
  add(data: address.IAddressItem) {
    return requestAddress.start<object, { _id: string }>({
      data,
      action: "customer-address/add",
    });
  }
  /**
   * 删除一条地址
   */
  del(data: { addressId: string }) {
    return requestAddress.start<object, Array<address.IAddressItem>>({
      data,
      action: "customer-address/del",
    });
  }
  /**
   * 设置默认地址
   */
  setDefault(data: { addressId: string }) {
    return requestAddress.start<object, Array<address.IAddressItem>>({
      data,
      action: "customer-address/setDefault",
    });
  }
  /**
   * 修改一条地址
   */
  update(data: address.IAddressItem) {
    return requestAddress.start<object, { _id: string }>({
      data,
      action: "customer-address/update",
    });
  }
  /**
   * 查询仓库列表
   * @param data
   */
  getAddressList(data = {}) {
    return requestAddress.start<object, Array<address.IAddressItem>>({
      data,
      action: "customer-address/getList",
    });
  }
  /**
   * 查询默认地址
   * @param data
   */
  getAddressDefault(data = {}) {
    return requestAddress.start<object, address.IAddressItem>({
      data,
      action: "customer-address/getDefault",
    });
  }
  /**
   * 查询默认地址
   * @param data
   */
  resolveAddress<T = { addressStr: "" }>(data: T) {
    return requestAddress.start<T, Array<address.IAddressItem>>({
      data,
      action: "customer-address/resolveAddress",
    });
  }
}

export const address = new Address();
