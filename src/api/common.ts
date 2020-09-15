/**
 * @file 通用接口
 * @version 0.0.1
 * @author 冉娃娃 <274544338@qq.com>
 * @since 2020/9/15 11:30
 */
import { Request } from "./request";

const request = new Request('common');

class Common {
  /**
   * 上传文件
   */
  async uploadImage(data: admin.IQrItem) {
    try {
      const res = await request.uniCloud.uploadFile({
        filePath: data.src,
        cloudPath: `${data.tabType}${data.money}.${data.imgType}`,
        fileType: 'image',
      });
      return [null, res]
    } catch (e) {
      return [e, null];
    }
  }
}

export const common = new Common();
