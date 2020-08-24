export class Request {
  name: string = '';
  uniCloud: TypesUniCloud.UniCloud;

  constructor(name: string) {
    this.name = name;
    this.uniCloud = this.init();
  }

  init() {
    return uniCloud.init({
      provider: 'aliyun',
      spaceId: '66108fd9-83f0-4fda-9219-f9fe3a6a377e',
      clientSecret: 'BF6ATHIcf8W8kOr4gDgCSA==',
    })
  }

  async start(param: TypesUniCloud.DataReq) {
    try {
      const res = await this.uniCloud.callFunction({
        name: this.name,
        data: {
          ...param
        },
      });
      return this.handleCallFunctionRes(res);
    } catch (e) {
      return [e.message, null];
    }
  }

  handleCallFunctionRes(options: TypesUniCloud.CallFunctionRes): [any | null, any | null] {
    if (!options.success) {
      return [options, null];
    }
    const { result }: any = options;
    if (result.code !== 0) {
      return [result, null];
    }
    return [null, result];
  }
}
