import { CommonObjectType } from '@/types/common';
import { AuthorityToken } from '@/types/user-auth.d';
import { UserProfile } from '@/types/user-management.d';
import httpClient from '@/utils/request';
import { tokenUtil } from '@/utils/tokenUtil';
import { API_HOST } from './const';

const AUTH_API = `${API_HOST}/auth`;

export function setRedirectUrl() {
	return httpClient.get<string>(
		`${AUTH_API}/o/set-redirect-url`,
		{
			redirectUrl: window.location.href
		},
		{ needToken: false }
	);
}

export function fetchGithubUser(option: CommonObjectType = {}) {
	return httpClient.get<UserProfile>(`${AUTH_API}/me`, {}, option);
}

export function refreshAccessToken() {
	return httpClient.post<AuthorityToken>(
		`${AUTH_API}/o/refresh/access-token`,
		{
			refreshToken: tokenUtil.getRefreshToken() || ''
		},
		{ needToken: false }
	);
}

export function refreshAuthorityToken() {
	return httpClient.post<AuthorityToken>(
		`${AUTH_API}/o/refresh/authority-token`,
		{
			refreshToken: tokenUtil.getRefreshToken() || ''
		},
		{ needToken: false }
	);
}
