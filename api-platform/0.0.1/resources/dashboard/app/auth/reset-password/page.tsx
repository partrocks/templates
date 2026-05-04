import { redirect } from "next/navigation";

function searchParamsToQueryString(
    params: Record<string, string | string[] | undefined>,
): string {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
            for (const item of value) {
                qs.append(key, item);
            }
        } else {
            qs.set(key, value);
        }
    }
    return qs.toString();
}

/** Email links may use `/auth/reset-password`; the form lives at `/auth/password/reset`. */
export default async function ResetPasswordAliasPage(props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const searchParams = await props.searchParams;
    const q = searchParamsToQueryString(searchParams);
    redirect(q ? `/auth/password/reset?${q}` : "/auth/password/reset");
}
