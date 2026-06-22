export declare const config: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly isProduction: boolean;
    readonly isRender: boolean;
    readonly databaseUrl: string;
    readonly frontendUrl: string;
    readonly corsOrigin: string[];
    readonly uploadDir: string;
    readonly maxFileSize: number;
    readonly jwt: {
        readonly secret: string;
        readonly expire: string;
        readonly refreshExpire: string;
    };
    readonly documentEncryptionKey: string;
    readonly email: {
        /** smtp | resend | auto (auto tries SMTP, falls back to Resend) */
        readonly provider: "smtp" | "resend" | "auto";
        readonly host: string | undefined;
        readonly port: number;
        readonly user: string | undefined;
        readonly pass: string | undefined;
        readonly from: string | undefined;
        readonly resendApiKey: string | undefined;
    };
    readonly payment: {
        readonly esewa: {
            readonly merchantCode: string | undefined;
            readonly secretKey: string | undefined;
        };
        readonly khalti: {
            readonly secretKey: string | undefined;
        };
    };
    readonly cloudinary: {
        readonly cloudName: string | undefined;
        readonly apiKey: string | undefined;
        readonly apiSecret: string | undefined;
    };
    readonly google: {
        readonly clientId: string | undefined;
        readonly clientSecret: string | undefined;
        readonly callbackUrl: string;
    };
    readonly dev: {
        /** Dev shortcuts are opt-in and never run in production */
        readonly helpersEnabled: boolean;
        readonly autoVerifyGuest: boolean;
        readonly exposeOtpInResponses: boolean;
        readonly bypassOtp: string;
        readonly guestEmail: string | undefined;
        readonly guestPassword: string;
        readonly adminEmail: string | undefined;
        readonly adminPassword: string;
    };
};
//# sourceMappingURL=index.d.ts.map