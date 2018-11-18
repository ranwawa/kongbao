import request from 'request';
export default {
  // 获取红包列表
  getList (param) {
    return request.request('redPacketList', param, 'get');
  },
  // 领取红包
  edit (param) {
    return request.request('redPacket/edit', param);
  }
};
