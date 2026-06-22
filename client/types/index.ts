export interface User {
  _id: string;
  fullname: string;
  email: string;
  mobile: string;
  skill: string;
  password?: string;
}

export interface Review {
  _id: string;
  taskprovider: string;
  taskworker: string;
  rating: number;
}

export interface RegisterForm {
  fullname: string;
  email: string;
  mobile: string;
  skill: string;
  password: string;
  confirmpassword: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ToastState {
  message: string;
  type: "success" | "error";
}
