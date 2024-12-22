export interface ResetPasswordDto {
	token: string;
	password: string;
}

export interface ResetPasswordResponse {
	message: string;
}
