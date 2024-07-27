import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface TokenStore {
    token: string;
    userId: string | null;
    setToken: (data: string) => void;
    setUserId: (data: string | null) => void;
}

const useTokenStore = create<TokenStore>()(
    devtools(
        persist(
            (set) => ({
                token: '',
                userId: null,
                setToken: (data: string) => set(() => ({ token: data })),
                setUserId: (data: string | null) => set(() => ({ userId: data })),
            }),
            { name: 'token-store' }
        )
    )
);

export default useTokenStore;

