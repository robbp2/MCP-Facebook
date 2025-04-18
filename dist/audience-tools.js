"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUsersToCustomAudience = exports.createLookalikeAudience = exports.deleteCustomAudience = exports.updateCustomAudience = exports.getCustomAudienceDetails = exports.getCustomAudiences = exports.createCustomAudience = void 0;
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
// Vytvoření vlastního publika
const createCustomAudience = async (name, description, customerFileSource, subtype = 'CUSTOM') => {
    try {
        const adAccount = getAdAccount();
        // Připravení parametrů pro vytvoření publika
        const params = {
            name,
            description,
            customer_file_source: customerFileSource,
            subtype
        };
        // Vytvoření vlastního publika - pass fields array (empty) first, then params
        const audience = await adAccount.createCustomAudience([], params);
        return {
            success: true,
            // Access ID directly from the returned audience object
            audienceId: audience.id,
            message: 'Vlastní publikum bylo úspěšně vytvořeno'
        };
    }
    catch (error) {
        console.error('Chyba při vytváření vlastního publika:', error);
        return {
            success: false,
            message: `Chyba při vytváření vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.createCustomAudience = createCustomAudience;
// Získání seznamu vlastních publik
const getCustomAudiences = async (limit = 10) => {
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
            audiences: audiences.map((audience) => ({
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
    }
    catch (error) {
        console.error('Chyba při získávání vlastních publik:', error);
        return {
            success: false,
            message: `Chyba při získávání vlastních publik: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.getCustomAudiences = getCustomAudiences;
// Získání detailů o konkrétním publiku
const getCustomAudienceDetails = async (audienceId) => {
    try {
        // Získání objektu vlastního publika
        const customAudience = new facebook_nodejs_business_sdk_1.CustomAudience(audienceId);
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
        // Use 'as any' and access via _data for properties after get()
        const audienceDetails = await customAudience.get(fields);
        // Formátování výsledku
        return {
            success: true,
            audience: {
                id: audienceDetails._data?.id,
                name: audienceDetails._data?.name,
                description: audienceDetails._data?.description,
                subtype: audienceDetails._data?.subtype,
                approximateCount: audienceDetails._data?.approximate_count,
                timeCreated: audienceDetails._data?.time_created,
                timeUpdated: audienceDetails._data?.time_updated,
                customerFileSource: audienceDetails._data?.customer_file_source,
                dataSource: audienceDetails._data?.data_source,
                rule: audienceDetails._data?.rule,
                operationStatus: audienceDetails._data?.operation_status,
                permissionForActions: audienceDetails._data?.permission_for_actions
            }
        };
    }
    catch (error) {
        console.error('Chyba při získávání detailů vlastního publika:', error);
        return {
            success: false,
            message: `Chyba při získávání detailů vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.getCustomAudienceDetails = getCustomAudienceDetails;
// Aktualizace vlastního publika
const updateCustomAudience = async (audienceId, name, description) => {
    try {
        // Získání objektu vlastního publika
        const customAudience = new facebook_nodejs_business_sdk_1.CustomAudience(audienceId);
        // Příprava parametrů pro aktualizaci
        const params = {};
        if (name)
            params.name = name;
        if (description)
            params.description = description;
        // Aktualizace vlastního publika
        await customAudience.update(params);
        return {
            success: true,
            message: 'Vlastní publikum bylo úspěšně aktualizováno'
        };
    }
    catch (error) {
        console.error('Chyba při aktualizaci vlastního publika:', error);
        return {
            success: false,
            message: `Chyba při aktualizaci vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.updateCustomAudience = updateCustomAudience;
// Odstranění vlastního publika
const deleteCustomAudience = async (audienceId) => {
    try {
        // Získání objektu vlastního publika
        const customAudience = new facebook_nodejs_business_sdk_1.CustomAudience(audienceId);
        // Odstranění vlastního publika - pass empty array for fields as per type defs
        await customAudience.delete([]);
        return {
            success: true,
            message: 'Vlastní publikum bylo úspěšně odstraněno'
        };
    }
    catch (error) {
        console.error('Chyba při odstraňování vlastního publika:', error);
        return {
            success: false,
            message: `Chyba při odstraňování vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.deleteCustomAudience = deleteCustomAudience;
// Vytvoření lookalike audience (podobného publika) na základě existujícího publika
const createLookalikeAudience = async (sourceAudienceId, name, description, country, ratio = 0.01 // 1% jako výchozí hodnota
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
        // Vytvoření lookalike audience - pass fields array (empty) first, then params
        const result = await adAccount.createCustomAudience([], params);
        return {
            success: true,
            // Access ID directly from the returned result object
            audienceId: result.id,
            message: 'Lookalike audience bylo úspěšně vytvořeno'
        };
    }
    catch (error) {
        console.error('Chyba při vytváření lookalike audience:', error);
        return {
            success: false,
            message: `Chyba při vytváření lookalike audience: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.createLookalikeAudience = createLookalikeAudience;
// Přidání uživatelů do vlastního publika
const addUsersToCustomAudience = async (audienceId, users, type = 'EMAIL') => {
    try {
        // Získání objektu vlastního publika
        const customAudience = new facebook_nodejs_business_sdk_1.CustomAudience(audienceId);
        // Příprava parametrů pro přidání uživatelů
        const params = {
            payload: {
                schema: type.toLowerCase(),
                data: users.map(user => user.data)
            }
        };
        // Přidání uživatelů do vlastního publika - Use 'as any' as addUsers might not be in types
        await customAudience.addUsers(params);
        return {
            success: true,
            message: 'Uživatelé byli úspěšně přidáni do vlastního publika'
        };
    }
    catch (error) {
        console.error('Chyba při přidávání uživatelů do vlastního publika:', error);
        return {
            success: false,
            message: `Chyba při přidávání uživatelů do vlastního publika: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
        };
    }
};
exports.addUsersToCustomAudience = addUsersToCustomAudience;
//# sourceMappingURL=audience-tools.js.map