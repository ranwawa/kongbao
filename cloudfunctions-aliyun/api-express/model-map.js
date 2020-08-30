const colModelMap = require("./db").colModelMap;
module.exports = class ModelMap {
  /**
   * 获取所有数据
   * @returns {Promise<*[]|*>}
   */
  async getList(param = {}) {
    const res = await colModelMap
      .aggregate()
      .match({
        ...param,
        isDeleted: false,
        isDisabled: false,
      })
      .lookup({
        from: "kb-sp-infos",
        localField: "spId",
        foreignField: "_id",
        as: "spList",
      })
      .project({
        spId: true,
        type: true,
        apiUrl: true,
        map: true,
        spList: true,
      })
      .end();
    uniCloud.logger.info("查询所有模型映射-结果", res);
    return !res || res.affectedDocs < 1 ? [] : res.data;
  }
};
