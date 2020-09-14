const aliHuoCangUpdateOrder = require("./alihuocang-update-order");
const funcMap = {
  cron00: aliHuoCangUpdateOrder,
};
exports.main = async (event, context) => {
  const { timingTriggerConfig = "" } = event;
  // 定时任务名称
  const timingName = timingTriggerConfig.replace(/[: *]/g, "");
  if (!timingName || !funcMap[timingName]) {
    return;
  }
  funcMap[timingName]();
};
