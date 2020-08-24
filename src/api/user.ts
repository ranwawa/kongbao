import {Request} from './request';

const request = new Request('user-controller');
const requestStart = request.start.bind(request);
class User {
  register(data: user.RegisterReq) {
    return requestStart({
      data,
      action: 'register',
    })
  }
}

export const user = new User();
