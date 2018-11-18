import request from './request';
export default {
  // 创建订单
  createOrder (param) {
    return request.request('setOrder', param);
  },
  // 获取快递公司信息
  getCompany (param) {
    return request.request('getExpress', param, 'get');
  },
  // 添加快递单号
  addNumber (param) {
    return request.request('setExpressNo', param);
  },
  // 上传表格
  uploadFile (param) {
    return request.request('uploadFile', param);
  },
  // 下载表格
  downloadExcel (param) {
    return request.request('downloadExcel', param);
  },
  // 获取买家订单列表
  getOrderList (param) {
    return request.request('getOrderList', param, 'get');
  },
  // 获取单个订单详情
  getOrderDetail (param) {
    return request.request('getOrderOne', param, 'get');
  },
  // 用户下载订单
  downLoadUserExcel (param) {
    return request.request('userDownloadExcel', param);
  },
  // 获取快递订单信息
  getCompanyDetail (param) {
    return request.request('getExpressNum', param, 'get');
  },
  // 清空库存
  clearStock (param) {
    return request.request('changeExpressNo', param);
  }
};
