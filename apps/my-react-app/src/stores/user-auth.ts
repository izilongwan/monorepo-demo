import { fetchGithubUser, refreshAuthorityToken } from '@/apis/user-auth';
import { UserProfile } from '@/types/user-management.d';
import { tokenUtil } from '@/utils/tokenUtil';
import { message } from 'antd';
import { create } from 'zustand';
import { useGlobalStore } from './global';

interface UserStore {
	user: UserProfile | null;
	loginLoading?: boolean;
	setUser: (user: UserProfile | null) => void;
	setLoginLoading: (loading: boolean) => void;

	fetchUserProfile: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	setUser: (user: UserStore['user']) => set({ user }),

	loginLoading: undefined,
	setLoginLoading: (loading: boolean) => set({ loginLoading: loading }),

	fetchUserProfile: async (setLoginLoading = true) => {
		try {
			setLoginLoading && set({ loginLoading: true });
			const userData = await fetchGithubUser().promise;
			set({ user: userData });
			// 直接访问全局 store，而不是调用 Hook
			const globalStore = useGlobalStore.getState();
			globalStore.updateGlobalState({ user: userData });
			const info = await refreshAuthorityToken().promise;
			if (info) {
				tokenUtil.setAccessToken(info.accessToken);
				tokenUtil.setRefreshToken(info.refreshToken);
				set({
					user: { ...userData, authorities: info.authorities }
				});
				globalStore.updateGlobalState({
					user: { ...userData, authorities: info.authorities }
				});
				message.success('权限刷新啦！');
			}
			message.success('登录成功');
		} catch (error) {
			set({ user: null });
			message.error(`获取用户信息失败 ${(error as Error).message}`);
		} finally {
			setLoginLoading && set({ loginLoading: false });
		}
	}
}));
