import { AdAccount, CustomAudience } from 'facebook-nodejs-business-sdk';
import { config } from '../config';

// Získání instance AdAccount
const getAdAccount = () => {
  return new AdAccount(config.facebook.accountId);
};

// Vytvoření vlastního publika
export const createCustomAudience = async (
  name: string,
  description: string,
  customerFileSource: string,
  subtype: string = 'CUSTOM'
) => {
  try {
    const adAccount = getAdAccount();
    
    // Připravení parametrů pro vytvoření publika
    const params = {
      name,
      description,
      customer_file_source: customerFileSource,
      subtype
    };
    
    // Vytvoření vlastního publika
    const audience = await adAccount.createCustomAudience([params]);
    
    return {
      success: true,
      audienceId: audience[0] ? audience[0].id : null,
      message: 'Vlastní publikum bylo úspěšně vytvořeno'
    };
  } catch (error) {
    console.error('Chyba při vytváření vlastního publika:', error);
    return {
      success: false,
      message: `Chyba při vytváření vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Získání seznamu vlastních publik
export const getCustomAudiences = async (limit = 10) => {
  try {
    const adAccount = getAdAccount();
    
    // Nastavení polí pro získání vlastních publik
    const fields = [
      'id', 
      'name', 
      'description', 
      'subtype', 
      'approximate_count', 
      'time_created', 
      'time_updated',
      'customer_file_source',
      'data_source',
      'rule'
    ];
    
    const params = {
      limit
    };
    
    // Získání vlastních publik
    const audiences = await adAccount.getCustomAudiences(fields, params);
    
    // Formátování výsledků
    return {
      success: true,
      audiences: audiences.map((audience: any) => ({
        id: audience.id,
        name: audience.name,
        description: audience.description,
        subtype: audience.subtype,
        approximateCount: audience.approximate_count,
        timeCreated: audience.time_created,
        timeUpdated: audience.time_updated,
        customerFileSource: audience.customer_file_source,
        dataSource: audience.data_source,
        rule: audience.rule
      }))
    };
  } catch (error) {
    console.error('Chyba při získávání vlastních publik:', error);
    return {
      success: false,
      message: `Chyba při získávání vlastních publik: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Získání detailů o konkrétním publiku
export const getCustomAudienceDetails = async (audienceId: string) => {
  try {
    // Získání objektu vlastního publika
    const customAudience = new CustomAudience(audienceId);
    
    // Načtení detailů vlastního publika
    const fields = [
      'id', 
      'name', 
      'description', 
      'subtype', 
      'approximate_count', 
      'time_created', 
      'time_updated',
      'customer_file_source',
      'data_source',
      'rule',
      'operation_status',
      'permission_for_actions'
    ];
    
    const audienceDetails = await customAudience.get(fields);
    
    // Formátování výsledku
    return {
      success: true,
      audience: {
        id: audienceDetails.id,
        name: audienceDetails.name,
        description: audienceDetails.description,
        subtype: audienceDetails.subtype,
        approximateCount: audienceDetails.approximate_count,
        timeCreated: audienceDetails.time_created,
        timeUpdated: audienceDetails.time_updated,
        customerFileSource: audienceDetails.customer_file_source,
        dataSource: audienceDetails.data_source,
        rule: audienceDetails.rule,
        operationStatus: audienceDetails.operation_status,
        permissionForActions: audienceDetails.permission_for_actions
      }
    };
  } catch (error) {
    console.error('Chyba při získávání detailů vlastního publika:', error);
    return {
      success: false,
      message: `Chyba při získávání detailů vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Aktualizace vlastního publika
export const updateCustomAudience = async (
  audienceId: string,
  name?: string,
  description?: string
) => {
  try {
    // Získání objektu vlastního publika
    const customAudience = new CustomAudience(audienceId);
    
    // Příprava parametrů pro aktualizaci
    const params: any = {};
    
    if (name) params.name = name;
    if (description) params.description = description;
    
    // Aktualizace vlastního publika
    await customAudience.update(params);
    
    return {
      success: true,
      message: 'Vlastní publikum bylo úspěšně aktualizováno'
    };
  } catch (error) {
    console.error('Chyba při aktualizaci vlastního publika:', error);
    return {
      success: false,
      message: `Chyba při aktualizaci vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Odstranění vlastního publika
export const deleteCustomAudience = async (audienceId: string) => {
  try {
    // Získání objektu vlastního publika
    const customAudience = new CustomAudience(audienceId);
    
    // Odstranění vlastního publika
    await customAudience.delete();
    
    return {
      success: true,
      message: 'Vlastní publikum bylo úspěšně odstraněno'
    };
  } catch (error) {
    console.error('Chyba při odstraňování vlastního publika:', error);
    return {
      success: false,
      message: `Chyba při odstraňování vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Vytvoření lookalike audience (podobného publika) na základě existujícího publika
export const createLookalikeAudience = async (
  sourceAudienceId: string, 
  name: string, 
  description: string,
  country: string,
  ratio: number = 0.01 // 1% jako výchozí hodnota
) => {
  try {
    const adAccount = getAdAccount();
    
    // Validace poměru (ratio musí být mezi 0.01 a 0.20)
    if (ratio < 0.01 || ratio > 0.2) {
      return {
        success: false,
        message: 'Poměr lookalike audience musí být mezi 0.01 a 0.2 (1% až 20%)'
      };
    }
    
    // Parametry pro vytvoření lookalike audience
    const params = {
      name,
      description,
      origin_audience_id: sourceAudienceId,
      subtype: 'LOOKALIKE',
      lookalike_spec: JSON.stringify({
        country,
        ratio,
        type: 'CUSTOM_AUDIENCE'
      })
    };
    
    // Vytvoření lookalike audience
    const result = await adAccount.createCustomAudience([params]);
    
    return {
      success: true,
      audienceId: result[0] ? result[0].id : null,
      message: 'Lookalike audience bylo úspěšně vytvořeno'
    };
  } catch (error) {
    console.error('Chyba při vytváření lookalike audience:', error);
    return {
      success: false,
      message: `Chyba při vytváření lookalike audience: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Přidání uživatelů do vlastního publika
export const addUsersToCustomAudience = async (
  audienceId: string,
  users: Array<{schema: string, data: string[]}>,
  type: string = 'EMAIL'
) => {
  try {
    // Získání objektu vlastního publika
    const customAudience = new CustomAudience(audienceId);
    
    // Příprava parametrů pro přidání uživatelů
    const params = {
      payload: {
        schema: type.toLowerCase(),
        data: users.map(user => user.data)
      }
    };
    
    // Přidání uživatelů do vlastního publika
    await customAudience.addUsers(params);
    
    return {
      success: true,
      message: 'Uživatelé byli úspěšně přidáni do vlastního publika'
    };
  } catch (error) {
    console.error('Chyba při přidávání uživatelů do vlastního publika:', error);
    return {
      success: false,
      message: `Chyba při přidávání uživatelů do vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};