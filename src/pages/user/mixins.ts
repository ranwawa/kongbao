// super.js
import Vue from "vue";
import Component from "vue-class-component";
import { user } from "@/api/user";
import {
  cellPhoneReg,
  emailReg,
  passwordReg,
  userNameReg,
} from "@/assets/js/regular";
import { uniWrapper } from "@/assets/js/uni-wrapper";

// Define a super class component
@Component
export default class Super extends Vue {
  formError: RegisterForm<string> = {
    username: "",
    password: "",
  };
  formFocus: RegisterForm<boolean> = {
    username: true,
    password: false,
  };
  /**
   * 验证表单
   */
  validateForm(
    e: RegisterForm<string>,
    validateConfirm: boolean = false
  ): boolean {
    const { username, password, confirm } = e;
    console.log(123);
    this.initPropValue();
    if (
      !emailReg.test(username) &&
      !cellPhoneReg.test(username) &&
      !userNameReg.test(username)
    ) {
      return this.handleErrorInput("用户名输入有误", "username");
    }
    if (!passwordReg.test(password)) {
      return this.handleErrorInput("密码输入有误", "password");
    }
    if (validateConfirm && password !== confirm) {
      return this.handleErrorInput("两次输入的密码不一致", "confirm");
    }
    return true;
  }
  /**
   * 初始化表单信息
   */
  initPropValue() {
    const { formFocus, formError } = this;
    for (let key in formError) {
      this.formError[key] = "";
    }
    for (let key in formFocus) {
      this.formFocus[key] = false;
    }
  }
  /**
   * 处理表单错误信息
   * @param msg
   * @param key
   */
  handleErrorInput(msg: string, key: string) {
    uniWrapper.showToastText(msg);
    this.formError[key] = msg;
    this.formFocus[key] = true;
    return false;
  }
}
