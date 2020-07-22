const uniID = require('uni-id');

exports.main = async event => {
	let { params } = event;
	console.log('event:', params);
	let res = {};
	let payload = {};
	
	switch (event.action) {
		case 'register':
		res = await uniID.register(params);
		break;
		case 'login':
		res = await uniId.login({
			...params,
			queryField: ['username', 'email', 'mobile'],
		});
		break;
		default:
		res = {
			code: 403,
			msg: '非法访问',
		};
		break;
		
	}
	console.log(res);
	return res;
}