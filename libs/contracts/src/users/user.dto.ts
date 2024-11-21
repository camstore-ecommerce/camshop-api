export interface UserDto {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	verified_email_at: Date;
	phone: string;
	status: string;
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