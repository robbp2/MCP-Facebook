export declare const config: {
    facebook: {
        appId: string;
        appSecret: string;
        accessToken: string;
        accountId: string;
    };
    server: {
        port: number;
    };
};
export declare const initFacebookSdk: () => void;
export declare const validateConfig: () => boolean;
