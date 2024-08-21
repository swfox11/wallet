"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(provider: string, amount: number) {
    
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        console.error("seeapps/user-app/app/lib/actions/createOnRamptxn"); 
        return {
            message: "Unauthenticated request"
        }
       
    }
    const token = (Math.random() * 1000000).toString();
    // const token= axiox.post("https://hdfcbank/txn/gettoken",{
    //     amount: amount
    //     user: session.user
    // })   
    // dummy banking api ...the token should come from the banking provider (hdfc/axis)

    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount * 100
        }
    });

    return {
        message: "Done"
    }
}
