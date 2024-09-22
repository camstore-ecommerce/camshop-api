export interface UserTokenPayload {
    email: string;
    role: string;
    sub: string;
}

export interface AdminTokenPayload {
    username: string;
    role: string;
    sub: string;
}