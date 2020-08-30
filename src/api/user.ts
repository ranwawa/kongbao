import { Request } from "./request";

const request = new Request("user-controller");
const requestStart = request.start.bind(request);
class User {
  register(data: user.RegisterReq) {
    return requestStart<user.RegisterReq, user.RegisterRes>({
      data,
      action: "register",
    });
  }
  login(data: user.LoginReq) {
    return requestStart<user.LoginReq, user.LoginRes>({
      data,
      action: "login",
    });
  }
}

export const user = new User();
