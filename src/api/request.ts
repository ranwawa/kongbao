import { uniWrapper } from "@/assets/js/uni-wrapper";
import { config } from "@/config";
import { ROUTE } from "@/assets/constant/common";

export class Request {
  name: string = "";
  uniCloud: TypesUniCloud.UniCloud;

  constructor(name: string = "") {
    this.name = name;
    this.uniCloud = this.init();
  }

  init() {
    return uniCloud.init(config.uniCloudSpace);
  }

  async start<TRes>(
    param: TypesUniCloud.DataReq<any>
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
      uniWrapper.hideLoading();
      uniWrapper.showToastText("网络异常,请稍后再试");
      return [e, null];
    }
  }

  handleCallFunctionRes<T>(
    options: TypesUniCloud.CallFunctionRes<T>
  ): [any | null, T | null] {
    if (!options.success) {
      options.error && uniWrapper.showToastText(options.error.message);
      return [options, null];
    }
    const { result }: any = options;
    switch (result.code) {
      case 0:
        return [null, result.data];
      case 401:
        const routeList = getCurrentPages();
        const route = routeList[routeList.length - 1];
        let redirectUrl =
          route.route === ROUTE.USER_LOGIN_HOME
            ? ROUTE.TAB_CATEGORY
            : route.route;
        // @ts-ignore
        const option = Object.entries(route.options)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        redirectUrl = encodeURIComponent(`/${redirectUrl}?${option}`);
        uniWrapper.navigateToPage(
          `${ROUTE.USER_LOGIN_HOME}?redirect=${redirectUrl}`
        );
        return [result, null];
      default:
        uniWrapper.showToastText(result.msg);
        return [result, null];
    }
  }
}
