- Steps to run locally
- Clone the repo

```jsx
https://github.com/swfox11/wallet.git
```

- npm install
- Run postgres either locally or on the cloud (eg azure,avien,neon.tech)

```jsx
docker run  -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```


- Add your correct environment variables in .env files(apps/user-app/.env and packages/db/.env) . (you can use .env.example)

- Go to `packages/db`
    - npx prisma migrate dev
    - npx prisma db seed
-  run `npm run dev`
- You can use google login but to better use p2p transaction feature you should login with ph no and password
- for Google login you need to create your credentials from GCP and fill in the .env file.
- Test login 1. phone - 2222222222 , password - bob
- Test login 2. phone - 1111111111 , password - alice
- To make the Onramp transaction successful, make a post request to http://localhost:3003/hdfcWebhook  with correct body parameters (find from your OnRamp Transaction database).