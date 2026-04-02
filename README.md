# n8n-nodes-convex-finance

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Convex Finance, providing access to 5 core resources for DeFi yield optimization. Enables automation of pool management, staking operations, governance participation, rewards tracking, and comprehensive analytics for Convex Finance protocol interactions.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Convex%20Finance-purple)
![Web3](https://img.shields.io/badge/Web3-Ethereum-lightblue)
![Yield Farming](https://img.shields.io/badge/Yield-Farming-green)

## Features

- **Pool Management** - Access and manage Curve pool deposits, withdrawals, and pool information
- **Staking Operations** - Automate CVX token staking, unstaking, and reward claiming processes
- **Governance Integration** - Participate in protocol governance through voting and proposal management
- **Rewards Tracking** - Monitor and claim CRV, CVX, and other protocol rewards efficiently
- **Analytics Dashboard** - Comprehensive analytics for portfolio performance and yield optimization
- **Real-time Data** - Live pool metrics, APY calculations, and reward distributions
- **Multi-Pool Support** - Interact with multiple Convex pools simultaneously
- **Automated Strategies** - Build complex DeFi automation workflows and yield farming strategies

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-convex-finance`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-convex-finance
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-convex-finance.git
cd n8n-nodes-convex-finance
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-convex-finance
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Convex Finance API key for authentication | Yes |
| Environment | API environment (mainnet/testnet) | Yes |
| Wallet Address | Ethereum wallet address for operations | Yes |
| Rate Limit | API rate limit per minute (default: 60) | No |

## Resources & Operations

### 1. Pools

| Operation | Description |
|-----------|-------------|
| Get Pool Info | Retrieve detailed information about specific Convex pools |
| List Pools | Get all available pools with current metrics |
| Get Pool APY | Fetch current and historical APY data for pools |
| Deposit | Deposit tokens into specified Convex pools |
| Withdraw | Withdraw tokens from Convex pools |
| Get Pool Balance | Check your balance in specific pools |

### 2. Staking

| Operation | Description |
|-----------|-------------|
| Stake CVX | Stake CVX tokens for vlCVX rewards |
| Unstake CVX | Unstake CVX tokens from the protocol |
| Get Staking Info | Retrieve current staking position and rewards |
| Lock CVX | Lock CVX for vlCVX with specified duration |
| Unlock CVX | Unlock matured CVX positions |
| Get Lock Status | Check lock duration and unlock dates |

### 3. Governance

| Operation | Description |
|-----------|-------------|
| List Proposals | Get all active and historical governance proposals |
| Vote on Proposal | Submit votes on governance proposals |
| Get Voting Power | Check current voting power and delegation status |
| Delegate Votes | Delegate voting power to another address |
| Get Proposal Details | Retrieve detailed information about specific proposals |
| Get Vote History | View historical voting activity |

### 4. Rewards

| Operation | Description |
|-----------|-------------|
| Claim Rewards | Claim available CRV, CVX, and other protocol rewards |
| Get Pending Rewards | Check pending rewards across all positions |
| Get Reward History | Retrieve historical reward claims and distributions |
| Compound Rewards | Automatically reinvest rewards into pools |
| Get Boost Status | Check current Curve gauge boost status |
| Calculate Rewards | Estimate future rewards based on current positions |

### 5. Analytics

| Operation | Description |
|-----------|-------------|
| Get Portfolio Summary | Comprehensive overview of all positions and performance |
| Get Performance Metrics | Historical performance data and yield calculations |
| Get Pool Comparison | Compare metrics across multiple pools |
| Get Yield Analysis | Detailed yield breakdown and optimization suggestions |
| Get Risk Metrics | Risk assessment for current portfolio positions |
| Export Data | Export analytics data in various formats |

## Usage Examples

```javascript
// Get pool information and current APY
{
  "poolId": "32",
  "includeMetrics": true,
  "includeHistorical": false
}
```

```javascript
// Stake CVX tokens for vlCVX rewards
{
  "amount": "1000",
  "lockDuration": "1209600",
  "autoCompound": true
}
```

```javascript
// Claim all pending rewards
{
  "claimCRV": true,
  "claimCVX": true,
  "claimExtra": true,
  "compound": false
}
```

```javascript
// Get comprehensive portfolio analytics
{
  "timeframe": "30d",
  "includeProjections": true,
  "breakdown": "by_pool",
  "currency": "USD"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | API authentication failed | Verify API key is correct and active |
| Insufficient Balance | Not enough tokens for transaction | Check wallet balance and gas fees |
| Pool Not Found | Specified pool ID doesn't exist | Verify pool ID from active pools list |
| Rate Limit Exceeded | Too many API requests | Implement delays between requests |
| Network Error | Blockchain network connectivity issues | Check Ethereum network status |
| Invalid Pool ID | Pool ID format is incorrect | Use valid numeric pool ID |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-convex-finance/issues)
- **Convex Finance Docs**: [docs.convexfinance.com](https://docs.convexfinance.com)
- **DeFi Community**: [Convex Finance Discord](https://discord.gg/convex)