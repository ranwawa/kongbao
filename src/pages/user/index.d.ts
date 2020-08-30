interface RegisterForm<T> {
  username: T;
  password: T;
  confirm?: T;
  [index: string]: T;
}
