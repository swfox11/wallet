import { SendCard } from "../../../components/SendCard";
import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
export default async function() {
    console.error("hiiiiiiiii");
    const session = await getServerSession(authOptions);
    console.log(session);
    if (session===null)
    {
        redirect('/api/auth/signin');
    }
    return <div className="w-full">
        <SendCard />
    </div>
}