import { Request } from "./request";

const requestAddress = new Request("customer");
class Address {
  /**
   * 删除一条地址
   */
  add(data: address.IAddressItem) {
    return requestAddress.start<object, { _id: string }>({
      data,
      action: "agent-address/add",
    });
  }

  /**
   * 删除一条地址
   */
  del(data: { addressId: string }) {
    return requestAddress.start<object, Array<address.IAddressItem>>({
      data,
      action: "agent-address/del",
    });
  }
  /**
   * 设置默认地址
   */
  setDefault(data: { addressId: string }) {
    return requestAddress.start<object, Array<address.IAddressItem>>({
      data,
      action: "agent-address/setDefault",
    });
  }
  /**
   * 修改一条地址
   */
  update(data: address.IAddressItem) {
    return requestAddress.start<object, { _id: string }>({
      data,
      action: "agent-address/update",
    });
  }
  /**
   * 查询仓库列表
   * @param data
   */
  getAddressList(data = {}) {
    return requestAddress.start<object, Array<address.IAddressItem>>({
      data,
      action: "agent-address/getList",
    });
  }
}

export const address = new Address();
