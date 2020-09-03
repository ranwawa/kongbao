export class BasePage {
  /**
   * 当前第几页
   */
  currentPage: number = 1;
  /**
   * 每页多少杀数据
   */
  pageSize: number = 10;
  /**
   * 是否还有更多数据
   */
  haveMore: boolean = true;
}
