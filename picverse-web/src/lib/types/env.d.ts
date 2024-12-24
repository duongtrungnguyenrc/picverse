declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_SERVER_ORIGIN: string;
    NEXT_PUBLIC_ACCESS_TOKEN_PREFIX: string;
    NEXT_PUBLIC_REFRESH_TOKEN_PREFIX: string;
    NEXT_PUBLIC_ENCRYPT_SECRET: string;
    NEXT_PUBLIC_ENCRYPT_ALGORITHM: string;
  }
}
