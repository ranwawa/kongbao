import request from './request';
export default {
  // 添加新地址
  create (param) {
    return request.request('address', param);
  },
  // 获取地址列表
  getList (param) {
    return request.request('getAddressList', param, 'get');
  },
  // 删除地址
  delete (param) {
    return request.request('address/del', param, 'get');
  },
  // 获取单条地址
  getSingle (param) {
    return request.request('address/one', param, 'get');
  },
  // 编辑地址
  edit (param) {
    return request.request('address/edit', param, 'post');
  },
  // 智能识别地址
  autoScan (param) {
    return request.request('addressOne', param, 'post');
  }
};
