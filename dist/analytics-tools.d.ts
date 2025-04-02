export declare const getCampaignInsights: (campaignId: string, timeRange?: {
    since: string;
    until: string;
}, metrics?: string[]) => Promise<{
    success: boolean;
    message: string;
    insights: null;
} | {
    success: boolean;
    insights: any[];
    message?: undefined;
} | {
    success: boolean;
    message: string;
    insights?: undefined;
}>;
export declare const getAccountInsights: (timeRange?: {
    since: string;
    until: string;
}, metrics?: string[], groupBy?: string) => Promise<{
    success: boolean;
    message: string;
    insights: null;
} | {
    success: boolean;
    insights: any[];
    message?: undefined;
} | {
    success: boolean;
    message: string;
    insights?: undefined;
}>;
export declare const compareCampaigns: (campaignIds: string[], timeRange?: {
    since: string;
    until: string;
}, metrics?: string[]) => Promise<{
    success: boolean;
    message: string;
    campaigns?: undefined;
} | {
    success: boolean;
    campaigns: {
        id: any;
        name: any;
        insights: any;
    }[];
    message?: undefined;
}>;
export declare const getCampaignDemographics: (campaignId: string, timeRange?: {
    since: string;
    until: string;
}) => Promise<{
    success: boolean;
    message: string;
    demographics: null;
} | {
    success: boolean;
    demographics: any;
    message?: undefined;
} | {
    success: boolean;
    message: string;
    demographics?: undefined;
}>;
