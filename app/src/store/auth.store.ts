import { create } from 'zustand'
import { User } from '../../type';
import api from '@/services/api';

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setAuthenticated: (isAuthenticated: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
    
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  setAuthenticated: (value: boolean) => set({isAuthenticated:value}),
  setUser : (user: User|null) => set({user}),
  setLoading: (value: boolean) => set({isLoading:value}),

  fetchAuthenticatedUser: async () => {
    set({isLoading:true})
    try{
        const user = await api.get('auth/profile').then((res:any) => res.data);
        if(user) set({user, isAuthenticated:true})
        else set({user:null, isAuthenticated:false})
    } catch(error){
        console.log(error,"Error fetching authenticated user")
        set({user:null, isAuthenticated:false})
    } finally {
        set({isLoading:false})
    }
}

}))

export default useAuthStore