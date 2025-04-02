"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignDemographics = exports.compareCampaigns = exports.getAccountInsights = exports.getCampaignInsights = void 0;
const facebook_nodejs_business_sdk_1 = require("facebook-nodejs-business-sdk");
const config_1 = require("./config"); // Correct import path
// Získání instance AdAccount
const getAdAccount = () => {
    // Ensure the account ID is available before creating the AdAccount instance
    if (!config_1.config.facebookAccountId) {
        throw new Error('Facebook Account ID není nakonfigurováno v config.ts.');
    }
    return new facebook_nodejs_business_sdk_1.AdAccount(config_1.config.facebookAccountId); // Correct config property access
};
// Získání insights (analytických dat) pro kampaň
const getCampaignInsights = async (campaignId, timeRange = { since: '2023-01-01', until: '2023-12-31' }, metrics = ['impressions', 'clicks', 'spend', 'cpc', 'ctr', 'reach', 'frequency']) => {
    try {
        // Získání objektu kampaně
        const campaign = new facebook_nodejs_business_sdk_1.Campaign(campaignId);
        // Nastavení parametrů pro získání insights
        const params = {
            time_range: timeRange,
            level: 'campaign'
        };
        // Získání insights
        const insights = await campaign.getInsights(metrics, params);
        if (!insights || insights.length === 0) {
            return {
                success: true,
                message: 'Žádná analytická data nejsou k dispozici pro zadané období',
                insights: null
            };
        }
        // Formátování výsledků
        const formattedInsights = insights.map((insight) => {
            // Vytvoření základního objektu s datem
            const result = {
                date_start: insight.date_start,
                date_stop: insight.date_stop
            };
            // Přidání všech metrik
            metrics.forEach(metric => {
                if (insight[metric] !== undefined) {
                    // Konverze výdajů z centů na příslušnou měnu
                    if (metric === 'spend') {
                        result[metric] = parseFloat(insight[metric] || '0');
                    }
                    else {
                        result[metric] = insight[metric];
                    }
                }
            });
            return result;
        });
        return {
            success: true,
            insights: formattedInsights
        };
    }
    catch (error) {
        console.error('Chyba při získávání analytických dat kampaně:', error);
        return {
            success: false,
            message: `Chyba při získávání analytických dat kampaně: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.getCampaignInsights = getCampaignInsights;
// Získání souhrnných analytických dat pro účet
const getAccountInsights = async (timeRange = { since: '2023-01-01', until: '2023-12-31' }, metrics = ['impressions', 'clicks', 'spend', 'cpc', 'ctr', 'reach', 'frequency'], groupBy = 'day') => {
    try {
        const adAccount = getAdAccount();
        // Nastavení parametrů pro získání insights
        const params = {
            time_range: timeRange,
            level: 'account'
        };
        if (groupBy) {
            params.time_increment = groupBy === 'day' ? 1
                : groupBy === 'week' ? 7
                    : groupBy === 'month' ? 30
                        : 1;
        }
        // Získání insights
        const insights = await adAccount.getInsights(metrics, params);
        if (!insights || insights.length === 0) {
            return {
                success: true,
                message: 'Žádná analytická data nejsou k dispozici pro zadané období',
                insights: null
            };
        }
        // Formátování výsledků
        const formattedInsights = insights.map((insight) => {
            // Vytvoření základního objektu s datem
            const result = {
                date_start: insight.date_start,
                date_stop: insight.date_stop
            };
            // Přidání všech metrik
            metrics.forEach(metric => {
                if (insight[metric] !== undefined) {
                    // Konverze výdajů z centů na příslušnou měnu
                    if (metric === 'spend') {
                        result[metric] = parseFloat(insight[metric] || '0');
                    }
                    else {
                        result[metric] = insight[metric];
                    }
                }
            });
            return result;
        });
        return {
            success: true,
            insights: formattedInsights
        };
    }
    catch (error) {
        console.error('Chyba při získávání analytických dat účtu:', error);
        return {
            success: false,
            message: `Chyba při získávání analytických dat účtu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.getAccountInsights = getAccountInsights;
// Porovnání výkonu kampaní
const compareCampaigns = async (campaignIds, timeRange = { since: '2023-01-01', until: '2023-12-31' }, metrics = ['impressions', 'clicks', 'spend', 'cpc', 'ctr', 'reach']) => {
    try {
        if (!campaignIds || campaignIds.length === 0) {
            return {
                success: false,
                message: 'Není zadána žádná kampaň pro porovnání'
            };
        }
        // Získání insights pro každou kampaň
        const campaignsData = await Promise.all(campaignIds.map(async (campaignId) => {
            const campaign = new facebook_nodejs_business_sdk_1.Campaign(campaignId);
            // Získání základních informací o kampani
            // Fetch the fields, assuming they update the 'campaign' object instance
            await campaign.get(['id', 'name']);
            // Získání insights pro kampaň
            const params = {
                time_range: timeRange
            };
            const insights = await campaign.getInsights(metrics, params);
            // Agregace dat insights
            let aggregatedInsights = {};
            if (insights && insights.length > 0) {
                metrics.forEach(metric => {
                    // Add types for sum (number) and item (any, or a more specific insight type if defined)
                    aggregatedInsights[metric] = insights.reduce((sum, item) => {
                        const value = parseFloat(item[metric] || '0');
                        return sum + value;
                    }, 0);
                });
            }
            return {
                // Try accessing fields via _data property (using 'as any' due to type uncertainty)
                id: campaign._data?.id,
                name: campaign._data?.name,
                insights: aggregatedInsights
            };
        }));
        return {
            success: true,
            campaigns: campaignsData
        };
    }
    catch (error) {
        console.error('Chyba při porovnávání kampaní:', error);
        return {
            success: false,
            message: `Chyba při porovnávání kampaní: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.compareCampaigns = compareCampaigns;
// Získání demografických údajů o publiku kampaně
const getCampaignDemographics = async (campaignId, timeRange = { since: '2023-01-01', until: '2023-12-31' }) => {
    try {
        // Získání objektu kampaně
        const campaign = new facebook_nodejs_business_sdk_1.Campaign(campaignId);
        // Nastavení parametrů pro získání demografických údajů
        const params = {
            time_range: timeRange,
            breakdowns: ['age', 'gender']
        };
        const metrics = ['impressions', 'clicks', 'spend', 'reach'];
        // Získání insights s demografickým rozdělením
        const insights = await campaign.getInsights(metrics, params);
        if (!insights || insights.length === 0) {
            return {
                success: true,
                message: 'Žádná demografická data nejsou k dispozici pro zadané období',
                demographics: null
            };
        }
        // Zpracování výsledků do strukturované podoby
        const demographics = {
            age: {},
            gender: {},
            ageGender: {}
        };
        insights.forEach((insight) => {
            const age = insight.age;
            const gender = insight.gender;
            const key = `${gender}_${age}`;
            // Přidání dat do kategorie věku
            if (!demographics.age[age]) {
                demographics.age[age] = {
                    impressions: 0,
                    clicks: 0,
                    spend: 0,
                    reach: 0
                };
            }
            // Přidání dat do kategorie pohlaví
            if (!demographics.gender[gender]) {
                demographics.gender[gender] = {
                    impressions: 0,
                    clicks: 0,
                    spend: 0,
                    reach: 0
                };
            }
            // Přidání dat do kombinované kategorie věk+pohlaví
            demographics.ageGender[key] = {
                impressions: parseInt(insight.impressions || '0'),
                clicks: parseInt(insight.clicks || '0'),
                spend: parseFloat(insight.spend || '0'),
                reach: parseInt(insight.reach || '0')
            };
            // Aktualizace agregací podle věku
            demographics.age[age].impressions += parseInt(insight.impressions || '0');
            demographics.age[age].clicks += parseInt(insight.clicks || '0');
            demographics.age[age].spend += parseFloat(insight.spend || '0');
            demographics.age[age].reach += parseInt(insight.reach || '0');
            // Aktualizace agregací podle pohlaví
            demographics.gender[gender].impressions += parseInt(insight.impressions || '0');
            demographics.gender[gender].clicks += parseInt(insight.clicks || '0');
            demographics.gender[gender].spend += parseFloat(insight.spend || '0');
            demographics.gender[gender].reach += parseInt(insight.reach || '0');
        });
        return {
            success: true,
            demographics
        };
    }
    catch (error) {
        console.error('Chyba při získávání demografických údajů:', error);
        return {
            success: false,
            message: `Chyba při získávání demografických údajů: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.getCampaignDemographics = getCampaignDemographics;
//# sourceMappingURL=analytics-tools.js.map