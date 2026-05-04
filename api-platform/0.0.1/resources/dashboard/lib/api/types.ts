/**
 * Tokens from POST /auth/register and /auth/login include `expires_in` (seconds).
 * POST /auth/token/refresh returns `refresh_token_expiration` (unix seconds) instead.
 */
export type AuthTokensResponse = {
    token: string;
    refresh_token: string;
    expires_in?: number;
    refresh_token_expiration?: number;
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

/** POST /auth/password/reset — request body */
export type PasswordResetCompleteBody = {
    selector: string;
    token: string;
    password: string;
};

/** GET /me */
export type MeResponse = {
    id: number;
    email: string;
    roles: string[];
};

/** Common `{ message }` JSON body (success or error). */
export type ApiMessageResponse = {
    message: string;
};

/** Typical JSON body for 4xx/5xx responses from this API */
export type ApiErrorResponse = ApiMessageResponse;

/** POST /auth/password/reset/request — success body */
export type PasswordResetRequestResponse = ApiMessageResponse;

/** POST /auth/password/reset — success body */
export type PasswordResetCompleteResponse = ApiMessageResponse;
