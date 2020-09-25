const AliHuoCangAsync = require("./alihuocang-async");
exports.main = async (event, context) => {
  const { timingTriggerConfig = "" } = event;
  // 定时任务名称
  const timingName = timingTriggerConfig.replace(/[: *]/g, "");
  const alhc = new AliHuoCangAsync();
  await alhc.syncStore();
  return {};
};
