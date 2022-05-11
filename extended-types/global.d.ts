declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            PORT: string;
            DB_URL: string;
            JWT_SECRET_KEY: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
        }
    }
}

export { };