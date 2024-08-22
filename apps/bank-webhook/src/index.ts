import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    // check if thr txn is processing and only then proceed
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };


    try {
        await db.$transaction(async (transaction) => {
            // Check if a balance record exists for the user
            const balanceExists = await transaction.balance.findUnique({
              where: {
                userId: Number(paymentInformation.userId),
              },
            });
          
            
            if (!balanceExists) {
              await transaction.balance.create({
                data: {
                  userId: Number(paymentInformation.userId),
                  amount: 0, // Initial balance
                  locked: 0,
                },
              });
            }
          
            // Update the balance and the transaction status
            await transaction.balance.updateMany({
              where: {
                userId: Number(paymentInformation.userId),
              },
              data: {
                amount: {
                  increment: Number(paymentInformation.amount),
                },
              },
            });
          
            await transaction.onRampTransaction.updateMany({
              where: {
                token: paymentInformation.token,
              },
              data: {
                status: "Success",
              },
            });
          });
          res.status(200).json({
            message: "Captured"
        })
          
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003,()=>{
  console.log(`webhook server listening an port 3003`);
});