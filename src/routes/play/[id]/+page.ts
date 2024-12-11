import type { PageLoad } from "./$types";

export const load = (async ({ params, url }) => {
	return {
		id: params.id,
		username: url.searchParams.get("username"),
	};
}) satisfies PageLoad
