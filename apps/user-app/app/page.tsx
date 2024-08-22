import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
//import { authOptions } from "./lib/auth";
import { authOptions } from "./lib/auth"; 
export default async function Page() {
  const session = await getServerSession(authOptions);
  //if signed in I send user to dashboard else send them to signin page
  if (session?.user) {
    
    redirect('/dashboard')
  } else {
    redirect('/api/auth/signin')
  }
}
