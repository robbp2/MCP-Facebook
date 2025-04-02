"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdAccount = exports.initFacebookSdk = exports.validateConfig = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const facebook_nodejs_business_sdk_1 = require("facebook-nodejs-business-sdk");
// Načtení proměnných prostředí ze souboru .env
dotenv_1.default.config();
// Načtení konfigurace z proměnných prostředí
exports.config = {
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    facebookAccessToken: process.env.FACEBOOK_ACCESS_TOKEN,
    facebookAccountId: process.env.FACEBOOK_ACCOUNT_ID,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000, // Default port 3000
};
// Funkce pro validaci konfigurace
const validateConfig = () => {
    const requiredVars = [
        'facebookAppId',
        'facebookAppSecret',
        'facebookAccessToken',
        'facebookAccountId',
    ];
    for (const key of requiredVars) {
        if (!exports.config[key]) {
            console.error(`Chybějící konfigurační proměnná: ${key.toUpperCase()}`);
            return false;
        }
    }
    return true;
};
exports.validateConfig = validateConfig;
// Funkce pro inicializaci Facebook SDK
const initFacebookSdk = () => {
    if (!(0, exports.validateConfig)()) {
        throw new Error('Nelze inicializovat Facebook SDK: Chybí konfigurace.');
    }
    // We know these are defined because validateConfig passed
    facebook_nodejs_business_sdk_1.FacebookAdsApi.init(exports.config.facebookAccessToken);
    // Optional: Set a default AdAccount instance if needed frequently
    // const account = new AdAccount(config.facebookAccountId!);
    // console.log('Facebook SDK inicializováno pro účet:', config.facebookAccountId);
};
exports.initFacebookSdk = initFacebookSdk;
// Funkce pro získání instance AdAccount
const getAdAccount = () => {
    if (!exports.config.facebookAccountId) {
        throw new Error('Facebook Account ID není nakonfigurováno.');
    }
    return new facebook_nodejs_business_sdk_1.AdAccount(exports.config.facebookAccountId);
};
exports.getAdAccount = getAdAccount;
//# sourceMappingURL=config.js.map