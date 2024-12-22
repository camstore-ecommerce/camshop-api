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