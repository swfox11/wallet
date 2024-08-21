import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from 'next/navigation'
import { Session } from "inspector";

async function getBalance() {
    console.error("hiiiiiiiii");
    const session = await getServerSession(authOptions);
    console.log(session);
    if (session===null)
    {
        console.error("hello");
        redirect('/api/auth/signin');
    }
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map((t :any)=> ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}


export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();
    const session = await getServerSession(authOptions);
    console.log(session.user);
    return <div className="w-screen">
        <div className="text-4xl text-[#6e54aa] pt-8 mb-8 font-bold flex justify-evenly" >
            <div>
              Dashboard
            </div>
            <div className="text-xl text-[#8d54aa]">
              USER: {session.user.name ||session.user.email}
            </div>
             

        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}