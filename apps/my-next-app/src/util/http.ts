export const http = async <T = any>(
	url: string,
	option: RequestInit = {},
	{ raw = false, checkCode = true }: { raw?: boolean; checkCode?: boolean } = {}
) =>
	fetch(url, option)
		.then((json) => json.json())
		.then((rs) => {
			if (!checkCode) {
				return rs;
			}

			if (checkCode && rs.code === 0) {
				return raw ? rs : (rs.data as T);
			}
			return Promise.reject(rs);
		});
