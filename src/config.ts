import dotenv from 'dotenv';
import { BusinessSdk } from 'facebook-nodejs-business-sdk';

// Načtení proměnných prostředí z .env souboru
dotenv.config();

// Výchozí hodnoty pro případ, že proměnné prostředí nejsou definované
const DEFAULT_PORT = 3000;

export const config = {
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
export const initFacebookSdk = (): void => {
  const { appId, appSecret } = config.facebook;
  
  if (!appId || !appSecret) {
    throw new Error('Facebook App ID a App Secret musí být nastaveny v .env souboru');
  }
  
  BusinessSdk.FacebookAdsApi.init(config.facebook.accessToken);
  console.log('Facebook Business SDK bylo inicializováno');
};

// Kontrola, zda jsou všechny potřebné proměnné prostředí nastaveny
export const validateConfig = (): boolean => {
  const { appId, appSecret, accessToken, accountId } = config.facebook;
  
  if (!appId || !appSecret || !accessToken || !accountId) {
    console.error('Chybí některé povinné Facebook proměnné prostředí. Zkontrolujte soubor .env');
    return false;
  }
  
  return true;
};