declare namespace TypesUniCloud {
  interface UniCloud {
    /**
     * 调用云函数-客户端
     */
    callFunction: CallFunction;

    /**
     * 初始化服务空间-客户端
     */
    init(options: InitOpt): UniCloud;

    /**
     * 云函数访问HTTP服务-node端
     */
    httpclient: any;
    /**
     * 获取数据库的引用-node端
     */
    database: () => ucDatabase.IDatabase;

    logger: ucLogger.ILogger;
  }

  /**
   * 云函数请求参数
   */
  interface DataReq<T> {
    /**
     * 云函数下面具体的方法名
     * 即具体的接口函数
     */
    action: string;
    /**
     * 该接口函数的请求入参
     */
    data?: T;
  }

  /**
   * 云函数响应 公共响应字段
   */
  interface DataBaseRes {
    code: number;
    msg: string;
  }

  /**
   * 云函数响应 列表响应字段
   */
  interface DataListRes<T> extends DataBaseRes {
    affectedDocs: number;
    data: T[];
  }

  /**
   * 调用云函数的函数
   */
  interface CallFunction {
    (options: CallFunctionOpt): CallFunctionRes;
  }

  /**
   * 客户端调用云函数入参
   */
  interface CallFunctionOpt {
    /**
     * 云函数名称
     */
    name: string;
    /**
     * 该云函数所需参数
     */
    data?: object;
  }
  /**
   * 客户端调用云函数响应
   */
  interface CallFunctionRes<T> {
    /**
     * 云函数执行结果
     */
    result: T;
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
    debugFunction?: boolean;
    /**
     * 服务空间地址，仅阿里云侧支持
     */
    endpoint?: string;
  }
}

declare namespace uc {
  interface IUniCloud {
    /**
     * 获取数据库实例
     * @param spaceId 同一账号下的，服务空间ID,仅腾讯云支持
     */
    database: (spaceId?: string) => ucDatabase.IDatabase;
  }
}
declare namespace ucDatabase {
  interface IDatabase {
    /**
     * 数据库操作符
     */
    command: ucCommand.ICommand;
    /**
     * 获取集合的引用。
     * @param name 指定需引用的集合名称。
     */
    collection: (name: string) => ucCollection.ICollection;
  }
}
declare namespace ucCommand {
  /**
   * 数据库操作符，通过 db.command 获取
   */
  interface ICommand {
    /**
     * 判断字段是否存在
     * @param value
     */
    exists: (value: boolean) => ICommand;
    /**
     * 数据库聚合操作符，通过 db.command.aggregate 获取
     */
    aggregate: IAggregateCommand;
  }

  interface IAggregateCommand
    extends IAggregateCommandObject,
      IAggregateCommandCondition,
      IAggregateCommandCompare,
      IAggregateCommandString {}

  /**
   * 聚合操作符-对象
   */
  interface IAggregateCommandObject {
    /**
     * 聚合操作符。将多个文档合并为单个文档
     */
    mergeObjects: (options: string | Array<string>) => Object;
  }

  /**
   * 聚合操作符-条件
   */
  interface IAggregateCommandCondition {
    /**
     * 聚合操作符。计算布尔表达式，返回指定的两个值其中之一
     * @param options
     */
    cond: (options: { if: any; then: any; else: any }) => Object;
  }
  /**
   * 聚合操作符-比较
   */
  interface IAggregateCommandCompare {
    /**
     * 聚合操作符。匹配两个值，如果前者大于后者则返回 true，否则返回 false
     * @param options
     */
    gt: (options: Array<any>) => Object;
  }

  /**
   * 聚合操作符-比较
   */
  interface IAggregateCommandString {
    /**
     * 聚合操作符。连接字符串，返回拼接后的字符串。
     * @param options
     */
    concat: (options: Array<any>) => Object;
  }
}
declare namespace ucCollection {
  /**
   * 数据库集合引用
   */
  interface ICollection {
    /**
     * 获取集合中指定记录的引用。方法接受一个 id 参数，指定需引用的记录的 _id。
     * @param id
     */
    doc: (id: string) => ucDocument.IDocument;
    /**
     * 新增记录，
     * 如果传入的记录对象没有 _id 字段，则由后台自动生成 _id；
     * 若指定了 _id，则不能与已有记录冲突
     * @param options
     */
    add: (options: Object) => Promise<AddRes>;
    /**
     * 发起聚合操作，
     * 定义完聚合流水线阶段之后需调用 end 方法标志结束定义并实际发起聚合操作
     */
    aggregate: () => ucAggregate.IAggregate;
    /**
     * 指定返回结果中记录需返回的字段
     * @param projection
     */
    field: (projection: Object) => ICollection;
    /**
     * 获取集合数据，
     * 或获取根据查询条件筛选后的集合数据。
     */
    get: () => Promise<{ affectedDocs: number; data: Array<Object> }>;
    /**
     * 更新多条记录
     */
    update: (options) => Promise<Object>;
    /**
     * 指定查询条件，返回带新查询条件的新的集合引用
     * @param condition
     */
    where: (condition: Object) => ICollection;
    /**
     * 删除多条记录。
     * 注意只支持通过匹配 where 语句来删除，不支持 skip 和 limit。
     */
    remove: () => Promise<{ affectedDocs: number; deleted: number }>;
  }

  /**
   * 单条插入时
   */
  interface IAddResSingle {
    /**
     *
     */
    id: tring;
  }

  /**
   * 批量插入时
   */
  interface IAddResList {
    /**
     * 插入成功条数
     */
    inserted: number;
    /**
     * 批量插入所有记录的id
     */
    result: Object;
    /**
     * 批量插入所有记录的id
     */
    ids: Array<string>;
  }

  /**
   * 新增纪录时,返回格式
   */
  type AddRes = IAddResList;
}
declare namespace ucDocument {
  /**
   * 数据库记录引用
   */
  interface IDocument {
    /**
     * 获取记录数据，或获取根据查询条件筛选后的记录数据
     */
    get: () => Promise<Object>;
    /**
     * 删除一条记录
     */
    remove: () => Promise<Object>;
    /**
     * 替换更新一条记录
     * @param options
     */
    set: (options: Object) => Promise<Object>;
    /**
     * 更新一条记录
     * @param options
     */
    update: (options: Object) => Promise<Object>;
  }
}
declare namespace ucAggregate {
  /**
   * 数据库集合的聚合操作实例
   */
  interface IAggregate {
    /**
     * 聚合阶段。联表查询。
     * 与同个数据库下的一个指定的集合做 left outer join(左外连接)。
     * 对该阶段的每一个输入记录，lookup 会在该记录中增加一个数组字段，该数组是被联表中满足匹配条件的记录列表。
     * lookup 会将连接后的结果输出给下个阶段。
     */
    lookup: (options: IAggregateLookUpBaseEqual) => IAggregate;
    /**
     * 聚合阶段。
     * 根据条件过滤文档，并且把符合条件的文档传递给下一个流水线阶段。
     * @param options
     */
    match: (options: Object) => IAggregate;
    /**
     * 聚合阶段。
     * 把指定的字段传递给下一个流水线，
     * 指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段。
     * @param options
     */
    project: (options: Object) => IAggregate;
    /**
     * 聚合阶段。
     * 使用指定的数组字段中的每个元素，对文档进行拆分。
     * 拆分后，文档会从一个变为一个或多个，分别对应数组的每个元素。
     *  https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.unwind.html#%E7%A4%BA%E4%BE%8B
     * @param options
     */
    unwind: (options: IAggregateUnwindObject | string) => IAggregate;
    /**
     * 标志聚合操作定义完成，发起实际聚合操作
     */
    end: () => Promise<{ affectedDocs: number; data: Array[Object] }>;
    /**
     * 聚合阶段。
     * 指定一个已有字段作为输出的根节点，也可以指定一个计算出的新字段作为根节点。
     * @param Object
     */
    replaceRoot: (Object) => IAggregate;
    /**
     * 聚合阶段。指定一个正整数，跳过对应数量的文档，输出剩下的文档。
     * @param value
     */
    skip: (value: number) => IAggregate;
    /**
     * 聚合阶段。限制输出到下一阶段的记录数
     * @param value
     */
    limit: (value: number) => IAggregate;
  }
  interface IAggregateLookUpBase {
    /**
     * 要进行连接的另外一个集合的名字
     */
    from: string;
    /**
     * 指定连接匹配出的记录列表要存放的字段名，
     * 这个数组包含的是匹配出的来自 from 集合的记录。
     * 如果输入记录中本来就已有该字段，则该字段会被覆写
     */
    as: string;
  }
  interface IAggregateLookUpBaseEqual extends IAggregateLookUpBase {
    /**
     * 当前流水线的输入记录的字段名，
     * 该字段将被用于与 from 指定的集合的 foreignField 进行相等匹配。
     * 如果输入记录中没有该字段，则该字段的值在匹配时会被视作 null
     */
    localField: string;
    /**
     * 被连接集合的字段名，
     * 该字段会被用于与 localField 进行相等匹配。
     * 如果被连接集合的记录中没有该字段，该字段的值将在匹配时被视作 null
     */
    foreignField: string;
  }
  interface IAggregateUnwindObject {
    /**
     * 想要拆分的数组的字段名，需要以 $ 开头。
     */
    path: string;
    /**
     * 可选项，传入一个新的字段名，数组索引会保存在这个新的字段上。新的字段名不能以 $ 开头。
     */
    includeArrayIndex?: string;
    /**
     * 如果为 true，那么在 path 对应的字段为 null、空数组或者这个字段不存在时，依然会输出这个文档；
     * 如果为 false，unwind 将不会输出这些文档。默认为 false。
     */
    preserveNullAndEmptyArrays?: boolean;
  }
}

declare namespace ucLogger {
  /**
   * 高级日志
   * 会持久化存储（有效期30天）。
   */
  interface ILogger {
    log: (title: string, ...param) => void;
    info: (title: string, ...param) => void;
    warn: (title: string, ...param) => void;
    error: (title: string, ...param) => void;
  }
}

declare const uniCloud: TypesUniCloud.UniCloud;
