export declare const config: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly databaseUrl: string;
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
        readonly host: string | undefined;
        readonly port: number;
        readonly user: string | undefined;
        readonly pass: string | undefined;
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
};
//# sourceMappingURL=index.d.ts.map