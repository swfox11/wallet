import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db/client";
import { Console } from "console";
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
                    credentials: {
                        phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
                        password: { label: "Password", type: "password", required: true }
                    },
            // TODO: User credentials type from next-aut
                      async authorize(credentials: any)
                      {
                          // Do zod validation, OTP validation here
                          //hashing input password
                          const hashedPassword = await bcrypt.hash(credentials.password, 10);
                          //checking user existing or not
                          const existingUser = await db.user.findFirst({
                              where: {
                                  number: credentials.phone
                              }
                          });

                          if (existingUser?.password) {
                              
                              const passwordValidation = await bcrypt.compare(credentials.password, existingUser?.password);
                              console.error(passwordValidation);
                              if (passwordValidation) {
                                  //console.error("here");
                                  return {
                                      id: existingUser.id.toString(),
                                      name: existingUser.name,
                                      email: existingUser.number
                                  }
                              }
                              // existing user but wrong password
                              return null;
                          }
                          //console.log("here3");
                          //sign up the user if first time
                          try {
                              const user = await db.user.create({
                                  data: {
                                      number: credentials.phone,
                                      password: hashedPassword
                                  }
                              });
                          
                              return {
                                  id: user.id.toString(),
                                  name: user.name,
                                  email: user.number
                              }
                          } catch(e) {
                              console.error(e);
                          }

                          return null
                      },
            }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        
        async session({ token, session }: any) {
            
            
            
            if(session.user.name===null)//credential case
            {
                console.error(session.user.name);
               session.user.id = token.sub;
            }else{// google case
              console.log(session.user.email+"kaaaaaaaaaaa");

              await db.user.upsert({
                    select: {
                      id: true
                    },
                    where: {
                      email: session.user.email
                    },
                    create: {
                      email: session.user.email,
                      name: session.user.name,
                      //auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
                    },
                    update: {
                      name: session.user.name,
                      //auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
                    }
                  });
              const User = await prisma.user.findUnique({
                where: { email: session.user?.email },
              });
        
              if (User) {
                session.user.id = User.id; 
              }
            }
             //console.error(session.user.name);
             
             console.error("from call back");
            return session;
        }
      },
    
   
  }
  