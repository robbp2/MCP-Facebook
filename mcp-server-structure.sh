mkdir -p facebook-ads-mcp-server/src
cd facebook-ads-mcp-server

# Inicializace projektu
npm init -y

# Instalace závislostí
npm install @modelcontextprotocol/typescript-sdk express dotenv facebook-nodejs-business-sdk

# Vytvoření základních souborů
mkdir -p src/tools
mkdir -p src/resources
mkdir -p src/prompts

touch src/index.ts
touch src/config.ts
touch .env
touch src/tools/campaign-tools.ts
touch src/tools/audience-tools.ts 
touch src/tools/analytics-tools.ts
touch src/resources/campaign-data.ts
touch src/prompts/campaign-templates.ts
touch tsconfig.json
