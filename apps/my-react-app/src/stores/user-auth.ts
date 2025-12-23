import { UserProfile } from '@/types/user-management.d';
import { create } from 'zustand';

interface UserStore {
	user: UserProfile | null;
	setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	setUser: (user: UserStore['user']) => set({ user })
}));
