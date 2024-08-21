import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { Pe2PeTransfer } from "../../../components/pertoper"
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from 'next/navigation'

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
    }))
}
async function getP2PTransfer() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    
    return txns.map((t :any)=> ({
        time: t.timestamp,
        amount: t.amount,
    }));
}

export default async function() {
    // const balance = await getBalance();
    const transfer=await getP2PTransfer();
    const transactions=await getOnRampTransactions();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            transfers
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            
            
                
                <div className="pt-4">
                    <Pe2PeTransfer transfer={transfer}></Pe2PeTransfer>
                    
                </div>
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions}/>                   
                </div>
            
        </div>
    </div>
}