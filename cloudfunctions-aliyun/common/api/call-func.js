/**
 * @file 调用云函数
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/14 18:05
 */
module.exports = async ({ name = '', action = '', data = {} }) => {
  const res = await uniCloud.callFunction({
    name,
    data: { action, data },
  });
  if (res.success) {
    const { result } = res;
    if (result.code !== 0) {
      return [result, null];
    } else {
      return [null, result.data];
    }
  } else {
    return [res, null];
  }
};
