import request from './request';

export default {
  // 获取分类列表
  getArticleCateList(param) {
    return request.request('getArticleCate', param);
  },
  // 获取文章列表
  getArticleList(param) {
    return request.request('getArticleList', param);
  },
};
