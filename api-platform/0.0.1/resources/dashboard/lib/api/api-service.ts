import { ApiError } from "./api-error";
import type {
    AuthTokensResponse,
    LoginBody,
    MeResponse,
    PasswordResetCompleteBody,
    PasswordResetRequestBody,
    RefreshBody,
    RegisterBody,
} from "./types";

export type ApiServiceConfig = {
    baseUrl: string;
    /** Used by `me()` when you do not pass an explicit access token */
    getAccessToken?: () => string | null | undefined;
};

function normalizeBaseUrl(url: string): string {
    return url.trim().replace(/\/+$/, "");
}

async function readJsonSafely(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return undefined;
    try {
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
}

export class ApiService {
    private readonly baseUrl: string;
    private readonly getAccessToken?: () => string | null | undefined;

    constructor(config: ApiServiceConfig) {
        this.baseUrl = normalizeBaseUrl(config.baseUrl);
        this.getAccessToken = config.getAccessToken;
    }

    private async requestJson<T>(
        path: string,
        options: {
            method: string;
            body?: string;
            bearerToken?: string;
        },
    ): Promise<T> {
        const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
        const headers = new Headers();
        if (options.body !== undefined) {
            headers.set("Content-Type", "application/json");
        }
        if (options.bearerToken) {
            headers.set("Authorization", `Bearer ${options.bearerToken}`);
        }

        const response = await fetch(url, {
            method: options.method,
            headers,
            body: options.body,
        });

        const responseBody = await readJsonSafely(response);

        if (!response.ok) {
            const message =
                typeof responseBody === "object" &&
                responseBody !== null &&
                "message" in responseBody &&
                typeof (responseBody as { message: unknown }).message ===
                    "string"
                    ? (responseBody as { message: string }).message
                    : `Request failed (${response.status})`;
            throw new ApiError(message, response.status, responseBody);
        }

        return responseBody as T;
    }

    /**
     * GET /me
     * - Call with no arguments to use `getAccessToken` from config
     * - Pass `null` to omit Authorization explicitly
     */
    async me(accessToken?: string | null): Promise<MeResponse> {
        let bearer: string | undefined;
        if (accessToken === null) {
            bearer = undefined;
        } else if (typeof accessToken === "string") {
            bearer = accessToken;
        } else {
            const session = this.getAccessToken?.();
            bearer =
                typeof session === "string" && session.length > 0
                    ? session
                    : undefined;
        }

        return this.requestJson<MeResponse>("/me", {
            method: "GET",
            bearerToken: bearer,
        });
    }

    /** POST /auth/register */
    async register(body: RegisterBody): Promise<AuthTokensResponse> {
        return this.requestJson<AuthTokensResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    /** POST /auth/login */
    async login(body: LoginBody): Promise<AuthTokensResponse> {
        return this.requestJson<AuthTokensResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    /** POST /auth/token/refresh */
    async refreshTokens(body: RefreshBody): Promise<AuthTokensResponse> {
        return this.requestJson<AuthTokensResponse>("/auth/token/refresh", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    /** POST /auth/password/reset/request */
    async requestPasswordReset(
        body: PasswordResetRequestBody,
    ): Promise<unknown> {
        return this.requestJson<unknown>("/auth/password/reset/request", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    /** POST /auth/password/reset */
    async completePasswordReset(
        body: PasswordResetCompleteBody,
    ): Promise<unknown> {
        return this.requestJson<unknown>("/auth/password/reset", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
}

/**
 * Creates an ApiService using `NEXT_PUBLIC_API_URL` unless `baseUrl` is passed.
 * Trailing slashes on the base URL are stripped.
 */
export function createApiService(
    options?: Partial<ApiServiceConfig>,
): ApiService {
    const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
    const baseUrl = options?.baseUrl?.trim() ?? fromEnv;
    if (!baseUrl) {
        throw new Error(
            "ApiService requires baseUrl or NEXT_PUBLIC_API_URL to be set",
        );
    }
    return new ApiService({
        baseUrl: normalizeBaseUrl(baseUrl),
        getAccessToken: options?.getAccessToken,
    });
}
