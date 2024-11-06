// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v3.20.3
// source: proto/users/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "users";

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  expires: Date;
  user: User | undefined;
}

export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  expires: Date;
  user: Admin | undefined;
}

export interface UserRegisterDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface UserRegisterResponse {
  message: string;
  user: User | undefined;
}

export interface AuthenticateDto {
  Authentication: any;
}

export interface AuthenticateResponse {
  user: User;
}

export interface VerifyEmailDto {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  verified_email_at: Date;
  status: string;
  role: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ConfirmVerifyEmailDto {
  token: string;
}

export interface ConfirmVerifyEmailResponse {
  message: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  verified_email_at: Date;
  status: string;
  role: string;
  gender: unknown | null;
  birth_date: Date | null;
  profile_pic: string | null;
}

export interface Admin {
  id: string;
  username: string;
  admin_level: string;
  permissions: string[];
  role: string;
}

export const USERS_PACKAGE_NAME = "users";

export interface AuthServiceClient {
  login(request: UserLoginDto): Observable<UserLoginResponse>;

  adminLogin(request: AdminLoginDto): Observable<AdminLoginResponse>;

  register(request: UserRegisterDto): Observable<UserRegisterResponse>;

  authenticate(request: AuthenticateDto): Observable<AuthenticateResponse>;

  verifyEmail(request: VerifyEmailDto): Observable<VerifyEmailResponse>;

  confirmVerifyEmail(request: ConfirmVerifyEmailDto): Observable<ConfirmVerifyEmailResponse>;

  forgotPassword(request: ForgotPasswordDto): Observable<ForgotPasswordResponse>;

  resetPassword(request: ResetPasswordDto): Observable<ResetPasswordResponse>;
}

export interface AuthServiceController {
  login(request: UserLoginDto): Promise<UserLoginResponse> | Observable<UserLoginResponse> | UserLoginResponse;

  adminLogin(request: AdminLoginDto): Promise<AdminLoginResponse> | Observable<AdminLoginResponse> | AdminLoginResponse;

  register(
    request: UserRegisterDto,
  ): Promise<UserRegisterResponse> | Observable<UserRegisterResponse> | UserRegisterResponse;

  authenticate(
    request: AuthenticateDto,
  ): Promise<AuthenticateResponse> | Observable<AuthenticateResponse> | AuthenticateResponse;

  verifyEmail(request: VerifyEmailDto): Promise<VerifyEmailResponse> | Observable<VerifyEmailResponse> | VerifyEmailResponse;

  confirmVerifyEmail(
    request: ConfirmVerifyEmailDto,
  ): Promise<ConfirmVerifyEmailResponse> | Observable<ConfirmVerifyEmailResponse> | ConfirmVerifyEmailResponse;

  forgotPassword(request: ForgotPasswordDto): Promise<ForgotPasswordResponse> | Observable<ForgotPasswordResponse> | ForgotPasswordResponse;

  resetPassword(request: ResetPasswordDto): Promise<ResetPasswordResponse> | Observable<ResetPasswordResponse> | ResetPasswordResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "login",
      "adminLogin",
      "register",
      "authenticate",
      "verifyEmail",
      "confirmVerifyEmail",
      "forgotPassword",
      "resetPassword",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
