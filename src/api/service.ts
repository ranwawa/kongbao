import { Request } from "./request";

const request = new Request("controller-frontend");
class Service {
  /**
   * 添加一条地址
   */
  add(data: service.IAddressItem) {
    return request.start<{ _id: string }>({
      data,
      action: "customer-service/add",
    });
  }
  /**
   * 删除一条地址
   */
  del(data: { serviceId: string }) {
    return request.start<Array<service.IAddressItem>>({
      data,
      action: "customer-service/del",
    });
  }
  /**
   * 设置默认地址
   */
  setDefault(data: { serviceId: string }) {
    return request.start<Array<service.IAddressItem>>({
      data,
      action: "customer-service/setDefault",
    });
  }
  /**
   * 修改一条地址
   */
  update(data: service.IAddressItem) {
    return request.start<{ _id: string }>({
      data,
      action: "customer-service/update",
    });
  }
  /**
   * 查询服务地址列表
   * @param data
   */
  getAddressList(data = {}) {
    return request.start<Array<service.IAddressItem>>({
      data,
      action: "customer-service/getList",
    });
  }
  /**
   * 查询默认地址
   * @param data
   */
  getAddressDefault(data = {}) {
    return request.start<service.IAddressItem>({
      data,
      action: "customer-service/getDefault",
    });
  }
  /**
   * 解析地址
   */
  resolveAddress<T = { addressStr: "" }>(data: T) {
    return request.start<Array<service.IAddressItem>>({
      data,
      action: "customer-service/resolveAddress",
    });
  }
}

export const service = new Service();