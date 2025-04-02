# Facebook Ads MCP Server

MCP (Model Context Protocol) server pro zadávání a vyhodnocování reklamních kampaní na Facebooku s využitím Claude AI.

## Popis

Tento MCP server poskytuje rozhraní pro komunikaci s Facebook Marketing API pomocí protokolu MCP. Umožňuje Claude AI a dalším LLM modelům pracovat s Facebook reklamami – vytvářet a spravovat kampaně, analyzovat výsledky a optimalizovat výkon.

## Funkce

- **Správa reklamních kampaní**
  - Vytváření nových kampaní
  - Získání seznamu existujících kampaní
  - Úprava parametrů kampaní
  - Odstranění kampaní

- **Analytika a reportování**
  - Získání přehledu o výkonu kampaní
  - Srovnání více kampaní
  - Analýza účtu
  - Demografická analýza publika

- **Správa publik**
  - Vytváření vlastních publik
  - Vytváření lookalike publik
  - Správa seznamů uživatelů

- **AI asistence**
  - Šablony promptů pro Claude AI
  - Analýza výkonu kampaní
  - Doporučení pro optimalizaci

## Požadavky

- Node.js (verze 18 nebo vyšší)
- Facebook Business Manager účet
- Facebook App s přístupem k Marketing API
- Přístupový token s oprávněními pro Facebook Ads API
- Claude AI nebo jiný LLM s podporou MCP

## Instalace

1. Klonujte repozitář:
```bash
git clone https://github.com/yourusername/facebook-ads-mcp-server.git
cd facebook-ads-mcp-server
```

2. Nainstalujte závislosti:
```bash
npm install
```

3. Vytvořte soubor `.env` s následujícím obsahem:
```
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_ACCESS_TOKEN=your_access_token
FACEBOOK_ACCOUNT_ID=your_ad_account_id
PORT=3000
```

4. Zkompilujte TypeScript:
```bash
npm run build
```

5. Spusťte server:
```bash
npm start
```

## Konfigurace pro Claude Desktop

Pro použití tohoto MCP serveru s Claude Desktop přidejte následující konfiguraci do konfiguračního souboru Claude Desktop:

```json
{
  "mcpServers": {
    "facebook-ads": {
      "command": "node",
      "args": ["cesta/k/facebook-ads-mcp-server/dist/index.js"],
      "env": {
        "FACEBOOK_APP_ID": "your_app_id",
        "FACEBOOK_APP_SECRET": "your_app_secret",
        "FACEBOOK_ACCESS_TOKEN": "your_access_token",
        "FACEBOOK_ACCOUNT_ID": "your_ad_account_id"
      }
    }
  }
}
```

## Použití

### Vytvoření reklamní kampaně

Požádejte Claude AI o vytvoření nové reklamní kampaně. Claude může použít nástroj `create_campaign` k vytvoření kampaně přes Facebook API.

Příklad konverzace:
```
Uživatel: Vytvoř mi novou kampaň pro propagaci našeho e-shopu. Cílem je zvýšit prodeje. Denní rozpočet je 1000 Kč.

Claude: Připravím návrh nové reklamní kampaně pro váš e-shop...
```

### Analýza výkonu kampaní

Požádejte Claude AI o analýzu výkonu