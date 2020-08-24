const uniId = require('uni-id');
class User {
  constructor (event, context) {
	  this.event = event;
	  this.context = context;
  }
  async register(data) {
    return await(uniId.register(data));
  }
}
exports.main = async function (event, context) {
  const { action, data } = event;
  console.log(data);
  const user = new User(event, context);
  const controller = user[action];
  return controller
    ? await controller(data, event, context)
    : { code: 404, msg: '未找到访问的接口', };
}
