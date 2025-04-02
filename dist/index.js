"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@modelcontextprotocol/sdk"); // Correct SDK import
const config_1 = require("./config"); // Assuming config.ts exists, added getAdAccount
const campaignTools = __importStar(require("./campaign-tools")); // Assuming campaign-tools.ts exists
const audienceTools = __importStar(require("./audience-tools")); // Assuming audience-tools.ts exists
const analyticsTools = __importStar(require("./analytics-tools")); // Assuming analytics-tools.ts exists
const campaign_templates_1 = require("./campaign-templates"); // Assuming campaign-templates.ts exists
// Vytvoření loggeru
const logger = new sdk_1.SimpleLogger('facebook-ads-mcp-server');
// Funkce pro inicializaci serveru
const initializeServer = async () => {
    // Kontrola konfigurace
    if (!(0, config_1.validateConfig)()) {
        // Log the error before throwing
        logger.error('Neplatná konfigurace. Zkontrolujte .env soubor nebo proměnné prostředí.');
        throw new Error('Neplatná konfigurace. Zkontrolujte .env soubor nebo proměnné prostředí.');
    }
    // Inicializace Facebook SDK
    try {
        (0, config_1.initFacebookSdk)();
        logger.info('Facebook SDK inicializováno.');
    }
    catch (error) {
        logger.error('Chyba při inicializaci Facebook SDK:', error);
        throw new Error('Chyba při inicializaci Facebook SDK.');
    }
    // Vytvoření serveru
    const builder = (0, sdk_1.createServerBuilder)({
        name: 'facebook-ads-mcp-server',
        version: '1.0.0',
        description: 'MCP server pro zadávání a vyhodnocování reklamních kampaní na Facebooku pomocí Claude AI',
        transport: new sdk_1.StdioTransport({ logger }),
        logger
    });
    // --- Registrace nástrojů pro správu kampaní ---
    builder.tool({
        name: 'create_campaign',
        description: 'Vytvoří novou reklamní kampaň na Facebooku',
        // Add type for params based on inputSchema
        handler: async (params) => {
            // Basic validation (more robust validation might be needed)
            if (!params || typeof params !== 'object') {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Chybějící nebo neplatné parametry.');
            }
            const { name, objective, status, dailyBudget, startTime, endTime } = params;
            if (!name || !objective || !status) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Parametry name, objective a status jsou povinné.');
            }
            const result = await campaignTools.createCampaign(name, objective, status, dailyBudget ? parseFloat(dailyBudget) : undefined, startTime, // Allow undefined
            endTime // Allow undefined
            );
            return {
                content: [
                    {
                        type: 'text',
                        text: result.success
                            ? `✅ Kampaň byla úspěšně vytvořena!\n\nID kampaně: ${result.campaignId}\n\n${result.message || ''}`
                            : `❌ Chyba při vytváření kampaně: ${result.message}`
                    }
                ]
            };
        },
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Název kampaně' },
                objective: { type: 'string', description: 'Cíl kampaně (např. REACH, LINK_CLICKS, CONVERSIONS)' },
                status: { type: 'string', description: 'Status kampaně (ACTIVE, PAUSED)' },
                dailyBudget: { type: 'string', description: 'Denní rozpočet v měně účtu (např. "1000.50")' },
                startTime: { type: 'string', description: 'Čas začátku kampaně ve formátu ISO (YYYY-MM-DDTHH:MM:SS+0000)' },
                endTime: { type: 'string', description: 'Čas konce kampaně ve formátu ISO (YYYY-MM-DDTHH:MM:SS+0000)' }
            },
            required: ['name', 'objective', 'status']
        }
    });
    builder.tool({
        name: 'get_campaigns',
        description: 'Získá seznam reklamních kampaní',
        // Add type for params based on inputSchema
        handler: async (params) => {
            const { limit, status } = params || {};
            const result = await campaignTools.getCampaigns(limit ? parseInt(limit) : undefined, // Keep parsing logic
            status);
            if (!result.success) {
                return {
                    content: [{ type: 'text', text: `❌ Chyba při získávání kampaní: ${result.message}` }],
                    isError: true // Indicate error
                };
            }
            let responseText = `📋 Seznam reklamních kampaní (celkem ${result.campaigns?.length || 0}):\n\n`;
            if (!result.campaigns || result.campaigns.length === 0) {
                responseText += 'Nebyly nalezeny žádné kampaně odpovídající zadaným kritériím.';
            }
            else {
                // Add types for campaign and index in forEach
                result.campaigns.forEach((campaign, index) => {
                    responseText += `${index + 1}. **${campaign.name}** (ID: ${campaign.id})\n`;
                    responseText += `   - Cíl: ${campaign.objective || 'N/A'}\n`;
                    responseText += `   - Status: ${campaign.status || 'N/A'}\n`;
                    responseText += `   - Denní rozpočet: ${campaign.dailyBudget ? `${campaign.dailyBudget}` : 'Není nastaven'}\n`;
                    responseText += `   - Vytvořeno: ${campaign.createdTime ? new Date(campaign.createdTime).toLocaleDateString() : 'N/A'}\n\n`;
                });
            }
            return { content: [{ type: 'text', text: responseText }] };
        },
        inputSchema: {
            type: 'object',
            properties: {
                limit: { type: 'string', description: 'Maximální počet kampaní k zobrazení (číslo)' },
                status: { type: 'string', description: 'Filtrování podle statusu (ACTIVE, PAUSED, ARCHIVED)' }
            },
            additionalProperties: false // Disallow extra properties
        }
    });
    builder.tool({
        name: 'get_campaign_details',
        description: 'Získá detailní informace o konkrétní kampani',
        // Add type for params based on inputSchema
        handler: async (params) => {
            if (!params || typeof params !== 'object' || !params.campaignId) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Chybí povinný parametr campaignId.');
            }
            const { campaignId } = params;
            const result = await campaignTools.getCampaignDetails(campaignId);
            if (!result.success || !result.campaign) {
                return {
                    content: [{ type: 'text', text: `❌ Chyba při získávání detailů kampaně: ${result.message}` }],
                    isError: true
                };
            }
            const campaign = result.campaign;
            let responseText = `📊 Detaily kampaně "${campaign.name}" (ID: ${campaign.id}):\n\n`;
            responseText += `- **Základní informace:**\n`;
            responseText += `  - Cíl: ${campaign.objective || 'N/A'}\n`;
            responseText += `  - Status: ${campaign.status || 'N/A'}\n`;
            responseText += `  - Typ nákupu: ${campaign.buyingType || 'N/A'}\n`;
            responseText += `\n- **Rozpočet a finance:**\n`;
            responseText += campaign.dailyBudget ? `  - Denní rozpočet: ${campaign.dailyBudget}\n` : '';
            responseText += campaign.lifetimeBudget ? `  - Celoživotní rozpočet: ${campaign.lifetimeBudget}\n` : '';
            responseText += campaign.spendCap ? `  - Limit výdajů: ${campaign.spendCap}\n` : '';
            responseText += campaign.budgetRemaining ? `  - Zbývající rozpočet: ${campaign.budgetRemaining}\n` : '';
            if (!campaign.dailyBudget && !campaign.lifetimeBudget && !campaign.spendCap && !campaign.budgetRemaining) {
                responseText += `  (Žádné informace o rozpočtu)\n`;
            }
            responseText += `\n- **Časové údaje:**\n`;
            responseText += `  - Vytvořeno: ${campaign.createdTime ? new Date(campaign.createdTime).toLocaleString() : 'N/A'}\n`;
            responseText += campaign.startTime ? `  - Začátek: ${new Date(campaign.startTime).toLocaleString()}\n` : '';
            responseText += campaign.stopTime ? `  - Konec: ${new Date(campaign.stopTime).toLocaleString()}\n` : '';
            if (!campaign.startTime && !campaign.stopTime) {
                responseText += `  (Žádné informace o časech)\n`;
            }
            if (campaign.specialAdCategories && campaign.specialAdCategories.length > 0) {
                responseText += `\n- **Speciální kategorie reklam:** ${campaign.specialAdCategories.join(', ')}\n`;
            }
            return { content: [{ type: 'text', text: responseText }] };
        },
        inputSchema: {
            type: 'object',
            properties: {
                campaignId: { type: 'string', description: 'ID kampaně' }
            },
            required: ['campaignId'],
            additionalProperties: false
        }
    });
    builder.tool({
        name: 'update_campaign',
        description: 'Aktualizuje existující reklamní kampaň',
        // Add type for params based on inputSchema
        handler: async (params) => {
            if (!params || typeof params !== 'object' || !params.campaignId) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Chybí povinný parametr campaignId.');
            }
            const { campaignId, name, status, dailyBudget, endTime } = params;
            // Check if at least one updateable field is provided
            if (!name && !status && !dailyBudget && !endTime) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Musí být poskytnut alespoň jeden parametr k aktualizaci (name, status, dailyBudget, endTime).');
            }
            const result = await campaignTools.updateCampaign(campaignId, name, status, dailyBudget ? parseFloat(dailyBudget) : undefined, endTime);
            return {
                content: [
                    {
                        type: 'text',
                        text: result.success
                            ? `✅ Kampaň (ID: ${campaignId}) byla úspěšně aktualizována!\n\n${result.message || ''}`
                            : `❌ Chyba při aktualizaci kampaně (ID: ${campaignId}): ${result.message}`
                    }
                ]
            };
        },
        inputSchema: {
            type: 'object',
            properties: {
                campaignId: { type: 'string', description: 'ID kampaně k aktualizaci' },
                name: { type: 'string', description: 'Nový název kampaně' },
                status: { type: 'string', description: 'Nový status kampaně (ACTIVE, PAUSED)' },
                dailyBudget: { type: 'string', description: 'Nový denní rozpočet v měně účtu (např. "1500.00")' },
                endTime: { type: 'string', description: 'Nový čas konce kampaně ve formátu ISO (YYYY-MM-DDTHH:MM:SS+0000)' }
            },
            required: ['campaignId'],
            additionalProperties: false
        }
    });
    builder.tool({
        name: 'delete_campaign',
        description: 'Odstraní reklamní kampaň',
        // Add type for params based on inputSchema
        handler: async (params) => {
            if (!params || typeof params !== 'object' || !params.campaignId) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Chybí povinný parametr campaignId.');
            }
            const { campaignId } = params;
            const result = await campaignTools.deleteCampaign(campaignId);
            return {
                content: [
                    {
                        type: 'text',
                        text: result.success
                            ? `✅ Kampaň (ID: ${campaignId}) byla úspěšně odstraněna!\n\n${result.message || ''}`
                            : `❌ Chyba při odstraňování kampaně (ID: ${campaignId}): ${result.message}`
                    }
                ]
            };
        },
        inputSchema: {
            type: 'object',
            properties: {
                campaignId: { type: 'string', description: 'ID kampaně k odstranění' }
            },
            required: ['campaignId'],
            additionalProperties: false
        }
    });
    // --- Registrace nástrojů pro analýzu a vyhodnocování ---
    builder.tool({
        name: 'get_campaign_insights',
        description: 'Získá analytická data o výkonu reklamní kampaně',
        // Add type for params based on inputSchema
        handler: async (params) => {
            if (!params || typeof params !== 'object' || !params.campaignId || !params.since || !params.until) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Chybí povinné parametry: campaignId, since, until.');
            }
            const { campaignId, since, until, metrics } = params;
            const timeRange = {
                since: since,
                until: until
            };
            // Default metrics if not provided
            let metricsArray = ['impressions', 'clicks', 'spend', 'cpc', 'ctr', 'reach', 'frequency', 'actions'];
            if (metrics && typeof metrics === 'string') {
                metricsArray = metrics.split(',').map(m => m.trim()).filter(m => m.length > 0);
            }
            const result = await analyticsTools.getCampaignInsights(campaignId, timeRange, metricsArray);
            if (!result.success) {
                return {
                    content: [{ type: 'text', text: `❌ Chyba při získávání analytických dat: ${result.message}` }],
                    isError: true
                };
            }
            if (!result.insights || result.insights.length === 0) {
                return {
                    content: [{ type: 'text', text: `ℹ️ Nebyla nalezena žádná analytická data pro kampaň ${campaignId} v období ${since} - ${until}. ${result.message || ''}` }]
                };
            }
            // Assuming result.insights is an array, often Facebook API returns a single summary object in the array if no breakdown is requested.
            const summaryInsight = result.insights[0]; // Take the first (often only) item as summary
            // Formátování výsledků
            let responseText = `📈 Analytická data kampaně (ID: ${campaignId}) za období ${summaryInsight.date_start || since} - ${summaryInsight.date_stop || until}:\n\n`;
            // Display available metrics from the summary
            responseText += `**Souhrn:**\n`;
            metricsArray.forEach(metric => {
                if (summaryInsight[metric] !== undefined) {
                    // Special formatting for actions
                    if (metric === 'actions' && Array.isArray(summaryInsight[metric])) {
                        responseText += `- ${metric}:\n`;
                        summaryInsight[metric].forEach((action) => {
                            responseText += `    - ${action.action_type}: ${action.value}\n`;
                        });
                    }
                    else {
                        responseText += `- ${metric}: ${summaryInsight[metric]}\n`;
                    }
                }
            });
            // Add calculated metrics if underlying data exists
            const totalImpressions = parseInt(summaryInsight.impressions || '0');
            const totalClicks = parseInt(summaryInsight.clicks || '0');
            const totalSpend = parseFloat(summaryInsight.spend || '0');
            if (totalClicks > 0) {
                responseText += `- calculated_cpc: ${(totalSpend / totalClicks).toFixed(2)}\n`;
            }
            if (totalImpressions > 0) {
                responseText += `- calculated_ctr: ${((totalClicks / totalImpressions) * 100).toFixed(2)}%\n`;
                responseText += `- calculated_cpm: ${((totalSpend / totalImpressions) * 1000).toFixed(2)}\n`;
            }
            // If there are more insights (e.g., daily breakdown), display them
            if (result.insights.length > 1) {
                responseText += `\n**Detailní přehled (po dnech/rozpadech):**\n`;
                // Add types for insight and index in forEach
                result.insights.forEach((insight, index) => {
                    responseText += `\n* Záznam ${index + 1} (${insight.date_start} - ${insight.date_stop}):\n`;
                    metricsArray.forEach(metric => {
                        if (insight[metric] !== undefined) {
                            if (metric === 'actions' && Array.isArray(insight[metric])) {
                                responseText += `  - ${metric}:\n`;
                                insight[metric].forEach((action) => {
                                    responseText += `      - ${action.action_type}: ${action.value}\n`;
                                });
                            }
                            else {
                                responseText += `  - ${metric}: ${insight[metric]}\n`;
                            }
                        }
                    });
                });
            }
            return { content: [{ type: 'text', text: responseText }] };
        },
        inputSchema: {
            type: 'object',
            properties: {
                campaignId: { type: 'string', description: 'ID kampaně' },
                since: { type: 'string', description: 'Datum začátku ve formátu YYYY-MM-DD' },
                until: { type: 'string', description: 'Datum konce ve formátu YYYY-MM-DD' },
                metrics: { type: 'string', description: 'Volitelný seznam metrik oddělených čárkou (např. impressions,clicks,spend). Výchozí: impressions, clicks, spend, cpc, ctr, reach, frequency, actions' }
            },
            required: ['campaignId', 'since', 'until'],
            additionalProperties: false
        }
    });
    // --- Registrace nástrojů pro správu publik ---
    // (Předpokládá implementaci v audience-tools.ts)
    builder.tool({
        name: 'create_custom_audience',
        description: 'Vytvoří vlastní publikum na základě nahraných dat nebo jiných zdrojů',
        // Add type for params based on inputSchema
        handler: async (params) => {
            if (!params || typeof params !== 'object' || !params.name || !params.subtype) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Chybí povinné parametry: name, subtype.');
            }
            // Destructure expected params based on inputSchema and function signature
            const { name, description, subtype, customer_file_source /*, rule */ } = params;
            // Note: 'rule' is in inputSchema but not directly used by the current audienceTools.createCustomAudience
            // TODO: Enhance audienceTools.createCustomAudience to handle 'rule' for relevant subtypes if needed.
            // Validate required parameters for the function call
            if (!description || !customer_file_source) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Parametry description a customer_file_source jsou povinné pro CUSTOM subtype.');
            }
            // Volání funkce z audience-tools.ts - arguments match the function signature
            const result = await audienceTools.createCustomAudience(name, description, // description is the second argument
            customer_file_source, // customerFileSource is the third argument
            subtype // subtype is the fourth argument (optional, defaults to 'CUSTOM')
            );
            return {
                content: [{ type: 'text', text: result.success ? `✅ Vlastní publikum "${name}" (typ: ${subtype}) vytvořeno (ID: ${result.audienceId}). ${result.message || ''}` : `❌ Chyba: ${result.message}` }]
            };
        },
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Název publika' },
                subtype: { type: 'string', description: 'Podtyp publika (např. CUSTOM, WEBSITE, ENGAGEMENT, LOOKALIKE)' },
                description: { type: 'string', description: 'Volitelný popis publika' },
                customer_file_source: { type: 'string', description: 'Zdroj dat pro CUSTOM subtype (např. USER_PROVIDED_ONLY, PARTNER_PROVIDED_ONLY)' },
                rule: { type: 'object', description: 'Pravidlo pro WEBSITE nebo ENGAGEMENT subtype (JSON objekt dle FB API)' }
                // Add other relevant params like lookalike_spec for LOOKALIKE
            },
            required: ['name', 'subtype'],
            additionalProperties: true // Allow flexibility for different subtypes
        }
    });
    builder.tool({
        name: 'get_audiences', // Keep the tool name user-friendly
        description: 'Získá seznam dostupných vlastních publik',
        // Add type for params based on inputSchema (currently empty)
        handler: async (params) => {
            // Call the correct function name from audience-tools.ts
            // Pass potential limit param if schema is updated later
            const limitParam = params?.limit; // Use 'as any' carefully or define a proper type
            const result = await audienceTools.getCustomAudiences(limitParam ? parseInt(limitParam) : undefined);
            if (!result.success || !result.audiences) {
                return { content: [{ type: 'text', text: `❌ Chyba při získávání publik: ${result.message}` }], isError: true };
            }
            let responseText = `👥 Seznam dostupných vlastních publik (celkem ${result.audiences.length}):\n\n`;
            if (result.audiences.length === 0) {
                responseText += 'Nebyly nalezeny žádná publika.';
            }
            else {
                // Use the correct property names from the mapped result in getCustomAudiences
                // Add types for audience and index in forEach
                result.audiences.forEach((audience, index) => {
                    responseText += `${index + 1}. **${audience.name}** (ID: ${audience.id})\n`;
                    responseText += `   - Typ: ${audience.subtype || 'N/A'}\n`;
                    // Use approximateCount (number) instead of approximate_count_formatted (string)
                    responseText += `   - Přibližná velikost: ${audience.approximateCount ? audience.approximateCount : 'N/A'}\n`;
                    // delivery_status is not directly mapped in the current getCustomAudiences, needs adjustment if required.
                    // responseText += `   - Status doručení: ${audience.delivery_status?.code || 'N/A'}\n`; 
                    responseText += `   - Popis: ${audience.description || '-'}\n\n`;
                });
            }
            return { content: [{ type: 'text', text: responseText }] };
        },
        inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
        }
    });
    // --- Registrace nástrojů pro AI asistenci ---
    // (Předpokládá implementaci v campaign-templates.ts)
    builder.tool({
        name: 'generate_campaign_prompt',
        description: 'Vygeneruje prompt pro Claude AI pro vytvoření kampaně na základě šablony',
        // Add type for params based on inputSchema
        handler: async (params) => {
            if (!params || typeof params !== 'object' || !params.templateName || !params.variables) {
                throw new sdk_1.McpError(sdk_1.ErrorCode.InvalidParams, 'Chybí povinné parametry: templateName, variables.');
            }
            const { templateName, variables } = params;
            try {
                // Ensure variables is a Record<string, string>
                const varsRecord = typeof variables === 'object' && variables !== null
                    ? variables
                    : {};
                const prompt = (0, campaign_templates_1.fillPromptTemplate)(templateName, varsRecord);
                return { content: [{ type: 'text', text: `📝 Vygenerovaný prompt pro šablonu "${templateName}":\n\n${prompt}` }] };
            }
            catch (error) {
                logger.error(`Chyba při generování promptu '${templateName}':`, error);
                return { content: [{ type: 'text', text: `❌ Chyba při generování promptu: ${error.message}` }], isError: true };
            }
        },
        inputSchema: {
            type: 'object',
            properties: {
                templateName: {
                    type: 'string',
                    description: 'Název šablony promptu (např. new_product_launch, lead_generation). Dostupné šablony: ' + Object.keys(campaign_templates_1.prompts).join(', ')
                },
                variables: {
                    type: 'object',
                    description: 'Objekt s proměnnými pro vyplnění šablony (např. {"productName": "XYZ", "targetAudience": "...", "budget": "1000"})',
                    additionalProperties: { type: 'string' } // Allows any string key-value pairs
                }
            },
            required: ['templateName', 'variables'],
            additionalProperties: false
        }
    });
    return builder;
};
// Hlavní funkce pro spuštění serveru
const startServer = async () => {
    try {
        logger.info('🚀 Inicializace MCP serveru...');
        const builder = await initializeServer();
        const server = builder.build();
        // Handle graceful shutdown
        const shutdown = async () => {
            logger.info('🔌 Ukončování serveru...');
            await server.stop();
            logger.info('✅ Server byl úspěšně ukončen.');
            process.exit(0);
        };
        process.on('SIGINT', shutdown); // Ctrl+C
        process.on('SIGTERM', shutdown); // Terminate signal
        await server.start();
        logger.info('✅ MCP server úspěšně spuštěn a naslouchá na stdio.');
    }
    catch (error) {
        // Log the error object itself for more details
        logger.error('❌ Kritická chyba při startu serveru:', error instanceof Error ? error.stack : error);
        process.exit(1); // Ukončení procesu při chybě inicializace
    }
};
// Spuštění serveru
startServer();
//# sourceMappingURL=index.js.map