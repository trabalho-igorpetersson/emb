import HomePage from "@/components/pages/home-page";
import { ProductStoreProvider } from "@/providers/products-store-provider";
import { UserStoreProvider } from "@/providers/users-store-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { IUser } from "@/store/user-store";

export default async function Home() {

  const session = await getServerSession(authOptions)
  let user

  if(session){
    user = {
      amount: 100,
      email: session.user?.email as string,
      name: session.user?.name ?? "",
    }
  }else{
    user = null
  }
  
  return (
    <UserStoreProvider user={user as IUser | null}>
      <ProductStoreProvider>
        <HomePage />
      </ProductStoreProvider>
    </UserStoreProvider>
  )
}