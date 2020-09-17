import { Request } from "./request";

const request = new Request("controller-frontend");
class User {
  /**
   * 注册
   * @param data
   */
  register(data: user.RegisterReq) {
    return request.start<user.RegisterRes>({
      data,
      action: "user-anonymous/register",
    });
  }

  /**
   * 登录
   * @param data
   */
  login(data: user.LoginReq) {
    return request.start<user.LoginRes>({
      data,
      action: "user-anonymous/login",
    });
  }
  /**
   * 退出登录
   * @param data
   */
  logout(data = {}) {
    return request.start<any>({
      data,
      action: "user-auth/logout",
    });
  }
  /**
   * 获取用户信息
   */
  getUserInfo() {
    return request.start<user.IUserInfoRes>({
      action: "user-auth/getUserInfo",
      data: {},
    });
  }
}

export const user = new User();
