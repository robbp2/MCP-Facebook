# Facebook Ads MCP Server

MCP (Model Context Protocol) server for inputting and evaluating Facebook ad campaigns using Claude AI.

## Description

This MCP server provides an interface for communicating with the Facebook Marketing API via the MCP protocol. It allows Claude AI and other LLM models to work with Facebook ads – create and manage campaigns, analyze results, and optimize performance.

## Features

- **Campaign Management**
  - Creating new campaigns
  - Retrieving a list of existing campaigns
  - Editing campaign parameters
  - Deleting campaigns

- **Analytics and Reporting**
  - Retrieving campaign performance overviews
  - Comparing multiple campaigns
  - Account analysis
  - Audience demographic analysis

- **Audience Management**
  - Creating custom audiences
  - Creating lookalike audiences
  - Managing user lists

- **AI Assistance**
  - Prompt templates for Claude AI
  - Campaign performance analysis
  - Optimization recommendations

## Requirements

- Node.js (version 18 or higher)
- Facebook Business Manager account
- Facebook App with access to the Marketing API
- Access token with permissions for the Facebook Ads API
- Claude AI or another LLM supporting MCP

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Tisik79/MCP-Facebook.git
cd MCP-Facebook
```

2. Install dependencies
```
npm install
```

3. Create a .env file with the following content:
```
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_ACCESS_TOKEN=your_access_token
FACEBOOK_ACCOUNT_ID=your_ad_account_id
PORT=3000
```

4. Compile TypeScript:
```
npm run build
```

5. Start the server:
```
npm start
```

Configuration for Claude Desktop
```{
  "mcpServers": {
    "facebook-ads": {
      "command": "node",
      "args": ["path/to/facebook-ads-mcp-server/dist/index.js"],
      "env": {
        "FACEBOOK_APP_ID": "<YOUR_APP_ID>",
        "FACEBOOK_APP_SECRET": "<YOUR_APP_SECRET>",
        "FACEBOOK_ACCESS_TOKEN": "<YOUR_ACCESS_TOKEN>",
        "FACEBOOK_ACCOUNT_ID": "<YOUR_AD_ACCOUNT_ID>"
      }
    }
  }
}
```

##Available Tools

##Campaign Management Tools

```create_campaign``` - Create a new ad campaign

```get_campaigns``` - Retrieve a list of campaigns

```get_campaign_details``` - Retrieve details of a campaign

```update_campaign``` - Update a campaign

```delete_campaign``` - Delete a campaign

##Analytics and Evaluation Tools

```get_campaign_insights``` - Retrieve analytical data for a campaign

```get_account_insights``` - Retrieve summary data for the account

```compare_campaigns``` - Compare multiple campaigns

```get_campaign_demographics``` - Retrieve demographic data

##Audience Management Tools

```create_custom_audience``` - Create a custom audience

```get_custom_audiences``` - Retrieve a list of audiences

```create_lookalike_audience``` - Create a lookalike audience

```add_users_to_custom_audience``` - Add users to an audience


##Security

This MCP server requires access to your Facebook Business Manager account via an access token. Ensure this token is stored securely and not shared with unauthorized individuals.

For production deployment, we recommend:

Using a token with minimal required permissions

Using environment variables for sensitive data

Regularly refreshing access tokens

Implementing additional layers of security (firewall, VPN)
