"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.initFacebookSdk = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const facebook_nodejs_business_sdk_1 = require("facebook-nodejs-business-sdk");
// Načtení proměnných prostředí z .env souboru
dotenv_1.default.config();
// Výchozí hodnoty pro případ, že proměnné prostředí nejsou definované
const DEFAULT_PORT = 3000;
exports.config = {
    facebook: {
        appId: process.env.FACEBOOK_APP_ID || '',
        appSecret: process.env.FACEBOOK_APP_SECRET || '',
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
        accountId: process.env.FACEBOOK_ACCOUNT_ID || ''
    },
    server: {
        port: parseInt(process.env.PORT || DEFAULT_PORT.toString())
    }
};
// Inicializace Facebook Business SDK
const initFacebookSdk = () => {
    const { appId, appSecret } = exports.config.facebook;
    if (!appId || !appSecret) {
        throw new Error('Facebook App ID a App Secret musí být nastaveny v .env souboru');
    }
    facebook_nodejs_business_sdk_1.BusinessSdk.FacebookAdsApi.init(exports.config.facebook.accessToken);
    console.log('Facebook Business SDK bylo inicializováno');
};
exports.initFacebookSdk = initFacebookSdk;
// Kontrola, zda jsou všechny potřebné proměnné prostředí nastaveny
const validateConfig = () => {
    const { appId, appSecret, accessToken, accountId } = exports.config.facebook;
    if (!appId || !appSecret || !accessToken || !accountId) {
        console.error('Chybí některé povinné Facebook proměnné prostředí. Zkontrolujte soubor .env');
        return false;
    }
    return true;
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=config-file.js.map