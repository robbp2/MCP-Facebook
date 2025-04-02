// Šablony promptů pro MCP server Facebook Ads

export const prompts = {
  // Systémový prompt pro vytváření kampaní
  campaignCreation: {
    name: 'campaign_creation',
    description: 'Šablona pro vytvoření nové reklamní kampaně na Facebooku',
    arguments: [
      { name: 'product', description: 'Název produktu nebo služby', required: true },
      { name: 'target_audience', description: 'Cílová skupina pro kampaň', required: true },
      { name: 'budget', description: 'Rozpočet pro kampaň', required: true },
      { name: 'goal', description: 'Cíl kampaně (konverze, návštěvnost, povědomí)', required: true }
    ],
    messages: (args: Record<string, string>) => [
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: `Jsem připraven pomoci vám vytvořit novou reklamní kampaň na Facebooku pro produkt "${args.product}" s následujícími parametry:

Cílová skupina: ${args.target_audience}
Rozpočet: ${args.budget}
Cíl kampaně: ${args.goal}

Pro vytvoření efektivní kampaně potřebuji získat několik detailů:

1. Jaký je hlavní cíl kampaně? (zvýšení prodejů, generování leadů, zvýšení návštěvnosti webu)
2. Jaká je cílová demografická skupina? (věk, pohlaví, zájmy)
3. Jaký je plánovaný denní rozpočet?
4. Jak dlouho by měla kampaň běžet?
5. Jaké jsou klíčové výhody vašeho produktu, které byste chtěli v reklamě zdůraznit?

Po zodpovězení těchto otázek vám mohu pomoci vytvořit kampaň, nastavit cílení a doporučit optimální strategii pro dosažení vašich marketingových cílů.`
        }
      }
    ]
  },

  // Systémový prompt pro analýzu výkonu kampaně
  campaignAnalysis: {
    name: 'campaign_analysis',
    description: 'Šablona pro analýzu výkonu reklamní kampaně',
    arguments: [
      { name: 'campaign_id', description: 'ID kampaně pro analýzu', required: true },
      { name: 'time_period', description: 'Časové období pro analýzu (např. posledních 7 dní, posledních 30 dní)', required: true }
    ],
    messages: (args: Record<string, string>) => [
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: `Připravuji analýzu výkonu vaší reklamní kampaně s ID ${args.campaign_id} za období ${args.time_period}.

Pro kompletní analýzu budu sledovat tyto metriky:

1. Celkový dosah a dojem kampaně
2. Míru kliknutí (CTR) a náklady na kliknutí (CPC)
3. Konverze a náklady na konverzi
4. Návratnost investic (ROI)
5. Demografické údaje o publiku, které nejvíce reaguje
6. Výkon podle umístění reklamy (News Feed, Instagram, atd.)

Analýza vám poskytne přehled o tom, jak kampaň funguje, jaké jsou nejúčinnější aspekty a kde je prostor pro optimalizaci pro dosažení lepších výsledků.`
        }
      }
    ]
  },

  // Systémový prompt pro optimalizaci kampaně
  campaignOptimization: {
    name: 'campaign_optimization',
    description: 'Šablona pro optimalizaci existující reklamní kampaně',
    arguments: [
      { name: 'campaign_id', description: 'ID kampaně pro optimalizaci', required: true },
      { name: 'current_performance', description: 'Aktuální výkon kampaně (např. nízký CTR, vysoké CPC)', required: true },
      { name: 'optimization_goal', description: 'Cíl optimalizace (např. snížit CPC, zvýšit konverze)', required: true }
    ],
    messages: (args: Record<string, string>) => [
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: `Připravuji optimalizační strategii pro vaši reklamní kampaň s ID ${args.campaign_id}.

Aktuální výkon: ${args.current_performance}
Cíl optimalizace: ${args.optimization_goal}

Pro optimalizaci vaší kampaně provedu následující kroky:

1. Analýza současného nastavení a výkonu kampaně
2. Identifikace problematických oblastí na základě aktuálního výkonu
3. Navržení konkrétních optimalizačních kroků pro dosažení vašeho cíle optimalizace
4. Vytvoření plánu pro implementaci změn a monitorování výsledků

Optimalizace se může týkat různých aspektů kampaně, včetně:
- Úpravy cílení publika
- Přepracování kreativního obsahu
- Změny rozpočtu nebo nabídkové strategie
- Úpravy plánu a harmonogramu kampaně
- Změny umístění reklam

Implementací těchto optimalizací by mělo dojít ke zlepšení výkonu kampaně a dosažení vašeho cíle optimalizace.`
        }
      }
    ]
  },

  // Systémový prompt pro tvorbu reportu
  campaignReporting: {
    name: 'campaign_reporting',
    description: 'Šablona pro vytvoření reportu o výkonu reklamních kampaní',
    arguments: [
      { name: 'time_period', description: 'Časové období pro report (např. minulý měsíc, poslední čtvrtletí)', required: true },
      { name: 'campaigns', description: 'Seznam kampaní pro zahrnutí do reportu (ID kampaní oddělené čárkami)', required: false },
      { name: 'report_format', description: 'Požadovaný formát reportu (stručný přehled, detailní analýza)', required: false }
    ],
    messages: (args: Record<string, string>) => [
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: `Připravuji report o výkonu vašich reklamních kampaní za období ${args.time_period}.
${args.campaigns ? `Zahrnuté kampaně: ${args.campaigns}` : 'Report bude zahrnovat všechny aktivní kampaně.'}
Formát reportu: ${args.report_format || 'detailní analýza'}

Report bude obsahovat:

1. Přehled klíčových metrik pro celé reklamní účty
   - Celkový dosah, imprese a výdaje
   - Průměrné CTR, CPC a konverzní sazba
   - ROI a návratnost reklamních výdajů (ROAS)

2. Porovnání výkonu jednotlivých kampaní
   - Nejvýkonnější a nejméně výkonné kampaně
   - Trendy výkonu v průběhu času

3. Analýza publika
   - Demografické údaje o nejúspěšnějších segmentech
   - Zájmy a chování publika s nejvyšší mírou konverze

4. Doporučení pro optimalizaci
   - Konkrétní kroky pro zlepšení výkonu kampaní
   - Strategická doporučení pro budoucí kampaně

Tento report vám poskytne komplexní přehled o výkonu vašich reklamních aktivit a pomůže identifikovat příležitosti pro zlepšení v dalším období.`
        }
      }
    ]
  },

  // Systémový prompt pro tvorbu cílových skupin
  audienceCreation: {
    name: 'audience_creation',
    description: 'Šablona pro vytvoření nové cílové skupiny pro Facebook reklamy',
    arguments: [
      { name: 'audience_type', description: 'Typ publika (vlastní, lookalike, uložené)', required: true },
      { name: 'target_characteristics', description: 'Charakteristiky cílové skupiny', required: true }
    ],
    messages: (args: Record<string, string>) => [
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: `Připravuji návrh pro vytvoření nové cílové skupiny typu "${args.audience_type}" pro vaše Facebook reklamy.

Požadované charakteristiky cílové skupiny: ${args.target_characteristics}

Pro vytvoření efektivní cílové skupiny potřebuji následující informace:

1. Jaký je hlavní účel této cílové skupiny? (retargeting, akvizice nových zákazníků, apod.)
2. Máte existující data o zákaznících, která můžeme použít? (e-maily, telefonní čísla)
3. Jaké jsou demografické charakteristiky vaší ideální cílové skupiny? (věk, pohlaví, lokalita)
4. Jaké zájmy a chování by měla cílová skupina vykazovat?
5. Máte preferovanou velikost cílové skupiny?

Na základě těchto informací vám mohu pomoci vytvořit optimální cílovou skupinu pro vaše reklamní kampaně, která osloví ty správné uživatele a maximalizuje efektivitu vašich reklamních výdajů.`
        }
      }
    ]
  }
};

// Export typů pro práci s prompty
export type PromptName = keyof typeof prompts;
export type PromptArgs = Record<string, string>;

// Pomocná funkce pro získání šablony podle jména
export const getPromptTemplate = (name: string) => {
  const promptName = name as PromptName;
  return prompts[promptName] || null;
};

// Funkce pro vyplnění šablony konkrétními argumenty
export const fillPromptTemplate = (name: string, args: PromptArgs) => {
  const template = getPromptTemplate(name);
  if (!template) {
    throw new Error(`Šablona s názvem "${name}" neexistuje`);
  }
  
  // Kontrola, zda jsou poskytnuty všechny povinné argumenty
  const missingArgs = (template.arguments || [])
    .filter(arg => arg.required && !args[arg.name])
    .map(arg => arg.name);
  
  if (missingArgs.length > 0) {
    throw new Error(`Chybí povinné argumenty: ${missingArgs.join(', ')}`);
  }
  
  // Vyplnění šablony argumenty
  return template.messages(args);
};
