/**
 * @file 云函数相关资源
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/7/22 8:48
 */

// @ts-ignore
const uc = uniCloud.init({
  provider: 'aliyun',
  spaceId: '66108fd9-83f0-4fda-9219-f9fe3a6a377e',
  clientSecret: 'BF6ATHIcf8W8kOr4gDgCSA==',
  debugFunction: true,
});

export {
  uc,
}
