import { AdAccount, Campaign } from 'facebook-nodejs-business-sdk';
import { config } from '../config';

// Získání instance AdAccount
const getAdAccount = () => {
  return new AdAccount(config.facebook.accountId);
};

// Vytvoření nové kampaně
export const createCampaign = async (
  name: string,
  objective: string,
  status: string,
  dailyBudget?: number,
  startTime?: string,
  endTime?: string
) => {
  try {
    const adAccount = getAdAccount();
    
    // Připravení parametrů pro vytvoření kampaně
    const params: any = {
      name,
      objective,
      status
    };
    
    // Přidání volitelných parametrů pokud jsou poskytnuty
    if (dailyBudget) {
      params.daily_budget = dailyBudget * 100; // Facebook vyžaduje budget v nejmenších jednotkách měny (centy)
    }
    
    if (startTime) {
      params.start_time = startTime;
    }
    
    if (endTime) {
      params.end_time = endTime;
    }
    
    // Vytvoření kampaně
    const result = await adAccount.createCampaign([params]);
    
    return {
      success: true,
      campaignId: result[0] ? result[0].id : null,
      message: 'Kampaň byla úspěšně vytvořena'
    };
  } catch (error) {
    console.error('Chyba při vytváření kampaně:', error);
    return {
      success: false,
      message: `Chyba při vytváření kampaně: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Získání seznamu kampaní
export const getCampaigns = async (limit = 10, status?: string) => {
  try {
    const adAccount = getAdAccount();
    
    // Nastavení filtrů pro získání kampaní
    const fields = ['id', 'name', 'objective', 'status', 'created_time', 'start_time', 'stop_time', 'daily_budget', 'lifetime_budget'];
    const params: any = {
      limit
    };
    
    if (status) {
      params.filtering = [
        {
          field: 'status',
          operator: 'EQUAL',
          value: status
        }
      ];
    }
    
    // Získání kampaní
    const campaigns = await adAccount.getCampaigns(fields, params);
    
    // Formátování výsledků
    return {
      success: true,
      campaigns: campaigns.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        createdTime: campaign.created_time,
        startTime: campaign.start_time,
        stopTime: campaign.stop_time,
        dailyBudget: campaign.daily_budget ? campaign.daily_budget / 100 : null, // Konverze z centů
        lifetimeBudget: campaign.lifetime_budget ? campaign.lifetime_budget / 100 : null
      }))
    };
  } catch (error) {
    console.error('Chyba při získávání kampaní:', error);
    return {
      success: false,
      message: `Chyba při získávání kampaní: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Aktualizace kampaně
export const updateCampaign = async (
  campaignId: string,
  name?: string,
  status?: string,
  dailyBudget?: number,
  endTime?: string
) => {
  try {
    // Získání objektu kampaně
    const campaign = new Campaign(campaignId);
    
    // Příprava parametrů pro aktualizaci
    const params: any = {};
    
    if (name) params.name = name;
    if (status) params.status = status;
    if (dailyBudget) params.daily_budget = dailyBudget * 100;
    if (endTime) params.end_time = endTime;
    
    // Aktualizace kampaně
    await campaign.update(params);
    
    return {
      success: true,
      message: 'Kampaň byla úspěšně aktualizována'
    };
  } catch (error) {
    console.error('Chyba při aktualizaci kampaně:', error);
    return {
      success: false,
      message: `Chyba při aktualizaci kampaně: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Získání podrobností o kampani
export const getCampaignDetails = async (campaignId: string) => {
  try {
    // Získání objektu kampaně
    const campaign = new Campaign(campaignId);
    
    // Načtení detailů kampaně
    const fields = [
      'id', 'name', 'objective', 'status', 'created_time', 
      'start_time', 'stop_time', 'daily_budget', 'lifetime_budget',
      'spend_cap', 'budget_remaining', 'buying_type', 'special_ad_categories'
    ];
    
    const campaignDetails = await campaign.get(fields);
    
    // Formátování výsledku
    return {
      success: true,
      campaign: {
        id: campaignDetails.id,
        name: campaignDetails.name,
        objective: campaignDetails.objective,
        status: campaignDetails.status,
        createdTime: campaignDetails.created_time,
        startTime: campaignDetails.start_time,
        stopTime: campaignDetails.stop_time,
        dailyBudget: campaignDetails.daily_budget ? campaignDetails.daily_budget / 100 : null,
        lifetimeBudget: campaignDetails.lifetime_budget ? campaignDetails.lifetime_budget / 100 : null,
        spendCap: campaignDetails.spend_cap ? campaignDetails.spend_cap / 100 : null,
        budgetRemaining: campaignDetails.budget_remaining ? campaignDetails.budget_remaining / 100 : null,
        buyingType: campaignDetails.buying_type,
        specialAdCategories: campaignDetails.special_ad_categories
      }
    };
  } catch (error) {
    console.error('Chyba při získávání detailů kampaně:', error);
    return {
      success: false,
      message: `Chyba při získávání detailů kampaně: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};

// Odstranění kampaně
export const deleteCampaign = async (campaignId: string) => {
  try {
    // Získání objektu kampaně
    const campaign = new Campaign(campaignId);
    
    // Odstranění kampaně (ve skutečnosti je nastavena jako smazaná, ale zůstává v systému)
    await campaign.delete();
    
    return {
      success: true,
      message: 'Kampaň byla úspěšně odstraněna'
    };
  } catch (error) {
    console.error('Chyba při odstraňování kampaně:', error);
    return {
      success: false,
      message: `Chyba při odstraňování kampaně: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
    };
  }
};