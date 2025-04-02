export declare const prompts: {
    campaignCreation: {
        name: string;
        description: string;
        arguments: {
            name: string;
            description: string;
            required: boolean;
        }[];
        messages: (args: Record<string, string>) => {
            role: string;
            content: {
                type: string;
                text: string;
            };
        }[];
    };
    campaignAnalysis: {
        name: string;
        description: string;
        arguments: {
            name: string;
            description: string;
            required: boolean;
        }[];
        messages: (args: Record<string, string>) => {
            role: string;
            content: {
                type: string;
                text: string;
            };
        }[];
    };
    campaignOptimization: {
        name: string;
        description: string;
        arguments: {
            name: string;
            description: string;
            required: boolean;
        }[];
        messages: (args: Record<string, string>) => {
            role: string;
            content: {
                type: string;
                text: string;
            };
        }[];
    };
    campaignReporting: {
        name: string;
        description: string;
        arguments: {
            name: string;
            description: string;
            required: boolean;
        }[];
        messages: (args: Record<string, string>) => {
            role: string;
            content: {
                type: string;
                text: string;
            };
        }[];
    };
    audienceCreation: {
        name: string;
        description: string;
        arguments: {
            name: string;
            description: string;
            required: boolean;
        }[];
        messages: (args: Record<string, string>) => {
            role: string;
            content: {
                type: string;
                text: string;
            };
        }[];
    };
};
export type PromptName = keyof typeof prompts;
export type PromptArgs = Record<string, string>;
export declare const getPromptTemplate: (name: string) => {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
    messages: (args: Record<string, string>) => {
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[];
} | {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
    messages: (args: Record<string, string>) => {
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[];
} | {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
    messages: (args: Record<string, string>) => {
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[];
} | {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
    messages: (args: Record<string, string>) => {
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[];
} | {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
    messages: (args: Record<string, string>) => {
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[];
};
export declare const fillPromptTemplate: (name: string, args: PromptArgs) => {
    role: string;
    content: {
        type: string;
        text: string;
    };
}[];
