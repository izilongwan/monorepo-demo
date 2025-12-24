import { USER_AUTHORITITY } from './user-auth';

export interface AuthorityToken {
	accessToken: string;
	refreshToken: string;
	authorities: string[];
}

export type KeyOfUserAuthoritity = keyof typeof USER_AUTHORITITY;
