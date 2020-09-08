import { Request } from "./request";

const request = new Request("user-controller");
const requestStart = request.start.bind(request);
class User {
  /**
   * 注册
   * @param data
   */
  register(data: user.RegisterReq) {
    return requestStart<user.RegisterReq, user.RegisterRes>({
      data,
      action: "user-normal/register",
    });
  }

  /**
   * 登录
   * @param data
   */
  login(data: user.LoginReq) {
    return requestStart<user.LoginReq, user.LoginRes>({
      data,
      action: "user-normal/login",
    });
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return requestStart<any, user.IUserInfoRes>({
      action: "user-auth/getUserInfo",
    });
  }
}

export const user = new User();
