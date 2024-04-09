import { createStore } from 'zustand/vanilla'
import { IProduct } from './provider-store'

export interface IUser {
    name: string
    email: string
    password: string
    amount: number
}

export type UserState = {
    user: IUser | null
}

export type UserActions = {
    setUser: (user: IUser) => void
}

export type UserStore = UserState & UserActions

export const createUserStore = (
    initState: UserState 
) => {
    return createStore<UserStore>()((set) => ({
        ...initState,
        setUser: async (user: IUser) => {
            set({ user: user })
        }
    }
    ))
}