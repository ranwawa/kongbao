import { uniWrapper } from "@/assets/js/uni-wrapper";
import { config } from "@/config";

export class Request {
  name: string = "";
  uniCloud: TypesUniCloud.UniCloud;

  constructor(name: string) {
    this.name = name;
    this.uniCloud = this.init();
  }

  init() {
    return uniCloud.init(config.uniCloudSpace);
  }

  async start<TReq, TRes>(
    param: TypesUniCloud.DataReq<TReq>
  ): Promise<[any | null, TRes | null]> {
    await uniWrapper.showLoadingText();
    try {
      const res = await this.uniCloud.callFunction({
        name: this.name,
        data: {
          ...param,
        },
      });
      uniWrapper.hideLoading();
      return this.handleCallFunctionRes<TRes>(res);
    } catch (e) {
      return [e.message, null];
    }
  }

  handleCallFunctionRes<T>(
    options: TypesUniCloud.CallFunctionRes<T>
  ): [any | null, T | null] {
    console.log(options);
    if (!options.success) {
      return [options, null];
    }
    const { result }: any = options;
    if (result.code !== 0) {
      uniWrapper.showToastText(result.msg);
      return [result, null];
    }
    return [null, result.data];
  }
}
