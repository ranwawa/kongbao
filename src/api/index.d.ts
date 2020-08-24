declare namespace TypesUniCloud {
  interface UniCloud {
    /**
     * 调用云函数
     */
    callFunction: CallFunction

    /**
     * 初始化服务空间
     */
    init(options: InitOpt): UniCloud;
  }

  interface DataReq {
    /**
     * 云函数下面具体的方法名
     * 即具体的接口函数
     */
    action: string;
    /**
     * 该接口函数的请求入参
     */
    data?: any;
  }

  interface CallFunction {
    (options: CallFunctionOpt):  CallFunctionRes,
  }



  /**
   * 客户端调用云函数入参
   */
  interface CallFunctionOpt {
    /**
     * 云函数名称
     */
    name: string,
    /**
     * 该云函数所需参数
     */
    data?: object,
  }
  /**
   * 客户端调用云函数响应
   */
  interface CallFunctionRes {
    /**
     * 云函数执行结果
     */
    result: object;
    /**
     * 请求序列号，用于错误排查
     */
    requestId: string;
    success: boolean;
    header: any;
  }
  /**
   * 初始化服务空间同意参
   */
  interface InitOpt {
    /**
     * 目前仅支持aliyun
     */
    provider: string;
    /**
     * 服务空间ID
     * 注意是服务空间ID，不是服务空间名称
     */
    spaceId: string;
    /**
     * 仅阿里云支持，可以在uniCloud控制台服务空间列表中查看
     */
    clientSecret: string;
    /**
     * 是否启用云函数日志输出，仅开发阶段生效
     * 平台支持：APP、H5(使用HBuilderX内置浏览器获得更好的调试体验)
     */
    debugFunction?:boolean;
    /**
     * 服务空间地址，仅阿里云侧支持
     */
    endpoint?:string;
  }
}

namespace user {
  interface RegisterReq {
    /**
     * 用户名，唯一
     */
    userName: string;
    /**
     * 密码
     */
    password: string;
    /**
     * 自行设置用户的邀请码
     */
    myInviteCode?: string;
  }

  interface RegisterRes {

  }
}
declare const uniCloud: TypesUniCloud.UniCloud;
