'use client'

import { IUser, UserStore, createUserStore } from "@/store/user-store"
import { ReactNode, createContext, useContext, useRef } from "react"
import { StoreApi, useStore } from "zustand"

export const UserStoreContext = createContext<StoreApi<UserStore> | null>(
  null,
)

export interface UserStoreProviderProps {
  children: ReactNode
  user: IUser | null
}

export const UserStoreProvider = ({
  children,
  user
}: UserStoreProviderProps) => {
  const storeRef = useRef<StoreApi<UserStore>>()
  if (!storeRef.current) {
    storeRef.current = createUserStore({
      user: user
    })
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  )
}

export const useUserStore = <T,>(
  selector: (store: UserStore) => T,
): T => {
  const userStoreContext = useContext(UserStoreContext)

  if (!userStoreContext) {
    throw new Error(`useUserStore must be use within UserStoreProvider`)
  }

  return useStore(userStoreContext, selector)
}
