# Picverse

This project includes two main parts:

1. **NestJS Server** - Backend server integrated with MongoDB, Redis, JWT, GHN, and VNPay.
2. **Next.js Client** - Frontend client with integration to backend APIs and external services like GHN, Cloudflare, and Cloudinary.

---

## Preparing

### First step:

First. We need clone source code from repository (Repository include source code of web server, analytics server, client and env file of them)

```bash
git clone https:/github.com/duongtrungnguyenrc/picverse.git
```

### Environment requirement

- Docker (version 27.4.0 or later)
- Docker compose (version 2.32.4 or later)
- Node JS (version 20.14.0 or later)
- MongoDB (Optional)
- Redis server (Optional)
- Free port: 3000, 3001

---

### NestJS Server

Before running the NestJS server, make sure you have the required environment variables set up.

1. **Create `.env` file**:

   ```bash
   touch .env
   ```

2. **Add the following configuration to your `.env`file:**

   ```env
    # APP
    APPLICATION_RUNNING_PORT=
    CLIENT_ORIGIN=
    
    # MONGO DATABASE
    MONGO_URI=
    MONGO_PRIMARY_NAME=
    MONGO_CLOUD_NAME=
    MONGO_REPLICA_SET=
    MONGO_READ_PREFERENCE=
    
    # REDIS
    REDIS_URL=
    REDIS_TTL=
    
    # JWT
    JWT_ACCESS_SECRET=
    JWT_REFRESH_SECRET=
    JWT_ACCESS_TTL=
    JWT_REFRESH_TTL=
    
    # Mailer
    MAILER_USER=
    MAILER_PASSWORD=
    MAILER_HOST=
    MAILER_PORT=
    
    # OAuth
    OAUTH_CLIENT_ID=
    OAUTH_CLIENT_SECRET=
    OAUTH_CALLBACK_URL=
    
    # Push notification
    NOTIFICATION_PUBLIC_KEY=
    NOTIFICATION_PRIVATE_KEY=
    
    # Fcm
    FCM_PROJECT_ID=
    FCM_CLIENT_EMAIL=
    FCM_PRIVATE_KEY=
    
    # Client
    CLIENT_URL=
    CLIENT_DOMAIN=
    
    ############################################################################
    ## CLOUD STORAGE PROVIDER PLATFORM ##
    
    # CLIENT REDIRECT
    CLIENT_CLOUD_CALLBACK_URL=
    
    # Dropbox
    DROPBOX_APP_KEY=
    DROPBOX_APP_SECRET=
    DROPBOX_CALLBACK_URL=
    
    # Drive
    DRIVE_CALLBACK_URL=
   ```

### Next JS client

Before running the Next.js client, you must set up the environment variables for external services.

1. **Create `.env` file**:

   ```bash
   touch .env
   ```

2. **Add the following configuration to your `.env`file:**

   ```env
    NEXT_PUBLIC_API_SERVER_ORIGIN=
    
    # AUTH
    NEXT_PUBLIC_ACCESS_TOKEN_PREFIX=
    NEXT_PUBLIC_REFRESH_TOKEN_PREFIX=
    NEXT_PUBLIC_ENCRYPT_SECRET=
    NEXT_PUBLIC_ENCRYPT_ALGORITHM=
    
    # CLOUDINARY
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    NEXT_PUBLIC_CLOUDINARY_API_KEY=
    NEXT_PUBLIC_CLOUDINARY_API_SECRET=
    NEXT_PUBLIC_CLOUDINARY_API_BASE_URL=
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
   ```

## Start project

### With Docker compose:

To run project with Docker compose, run command:

```bash
   docker-compose up --build -d
```

### With Local Machine:

To run project on your local machine (without Docker), follow these steps:

1. **Install dependencies:**
   
Access folder with `cd` command and run this command from all server and client to download node package:

For server:

```bash
  cd picverse-server
```

```bash
  npm install
```

For client:

```bash
  cd picverse-web
```

```bash
  npm install
```

2. **Config data layer:**

```bash
chmod +x ./scripts/local-setup.sh
```

```bash
sh ./scripts/local-setup.sh
```

3. **Run project**

For server:

```bash
  cd picverse-server
```

```bash
  npm run start
```

For client:

```bash
  cd picverse-web
```

```bash
  npm start
```

