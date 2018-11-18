// export default wx;
// muse-ui的loading是实例关闭，需要同时创建多个实例时，关闭会出现问题
// import Loading from 'muse-ui-loading';
import Store from '../store';
import Message from 'muse-ui-message';

const store = Store();
export default {
  showLoading() {
    store.commit({
      type: 'UPDATE_LOADING',
      value: true,
    });
  },
  hideLoading() {
    store.commit({
      type: 'UPDATE_LOADING',
      value: false,
    });
  },
  getStorageSync(key) {
    return localStorage.getItem(key);
  },
  setStorageSync(key, value) {
    localStorage.setItem(key, value);
  },
  removeStorageSync(key) {
    return localStorage.removeItem(key);
  },
  showModal({ title, content }) {
    return new Promise((resolve, reject) => {
      Message.confirm(content, title).then(res => {
        if (res.result) {
          resolve(res);
        } else {
          reject(res);
        }
      }).catch(err => {
        reject(err);
      });
    });
  },
};
