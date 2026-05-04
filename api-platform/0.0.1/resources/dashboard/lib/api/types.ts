/** Tokens issued by POST /auth/register, /auth/login, and /auth/token/refresh */
export type AuthTokensResponse = {
    token: string;
    refresh_token: string;
    expires_in: number;
};

export type RegisterBody = {
    email: string;
    password: string;
};

export type LoginBody = {
    email: string;
    password: string;
};

export type RefreshBody = {
    refresh_token: string;
};

export type PasswordResetRequestBody = {
    email: string;
};

export type PasswordResetCompleteBody = {
    selector: string;
    token: string;
    password: string;
};

/** GET /me — replace with a concrete type when your API schema is documented. */
export type MeResponse = Record<string, unknown>;
