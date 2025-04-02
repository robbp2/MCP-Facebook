import { AdAccount } from 'facebook-nodejs-business-sdk';
interface AppConfig {
    facebookAppId: string | undefined;
    facebookAppSecret: string | undefined;
    facebookAccessToken: string | undefined;
    facebookAccountId: string | undefined;
    port: number;
}
export declare const config: AppConfig;
export declare const validateConfig: () => boolean;
export declare const initFacebookSdk: () => void;
export declare const getAdAccount: () => AdAccount;
export {};
