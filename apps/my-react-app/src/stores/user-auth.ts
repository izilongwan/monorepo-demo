import { UserProfile } from '@/types/user-management.d';
import { create } from 'zustand';

interface UserStore {
	user: UserProfile | null;
	loginLoading?: boolean;
	setUser: (user: UserProfile | null) => void;
	setLoginLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	setUser: (user: UserStore['user']) => set({ user }),

	loginLoading: undefined,
	setLoginLoading: (loading: boolean) => set({ loginLoading: loading })
}));
