/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-convexfinance/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ConvexFinance implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Convex Finance',
    name: 'convexfinance',
    icon: 'file:convexfinance.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Convex Finance API',
    defaults: {
      name: 'Convex Finance',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'convexfinanceApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Pools',
            value: 'pools',
          },
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'Governance',
            value: 'governance',
          },
          {
            name: 'Rewards',
            value: 'rewards',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          }
        ],
        default: 'pools',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['pools'] } },
  options: [
    { 
      name: 'Get Curve APYs', 
      value: 'getCurveApys', 
      description: 'Get APY data for all Curve pools', 
      action: 'Get Curve APYs' 
    },
    { 
      name: 'Get CVX APY', 
      value: 'getCvxApy', 
      description: 'Get CVX reward APY data', 
      action: 'Get CVX APY' 
    }
  ],
  default: 'getCurveApys',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['staking'] } },
  options: [
    { name: 'Get CVX Supply', value: 'getCvxSupply', description: 'Get total CVX supply and circulation data', action: 'Get CVX supply data' },
    { name: 'Get Platform Fees', value: 'getPlatformFees', description: 'Get platform fee data for staking', action: 'Get platform fees' }
  ],
  default: 'getCvxSupply',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['governance'] } },
  options: [
    { name: 'Get vlCVX Data', value: 'getVlCvxData', description: 'Get vlCVX staking and governance data', action: 'Get vlCVX data' },
    { name: 'Get Vote Data', value: 'getVoteData', description: 'Get voting data and governance metrics', action: 'Get vote data' }
  ],
  default: 'getVlCvxData',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['rewards'] } },
  options: [
    { name: 'Get Revenue', value: 'getRevenue', description: 'Get protocol revenue and reward distribution data', action: 'Get revenue data' },
    { name: 'Get Revenue By Period', value: 'getRevenueByPeriod', description: 'Get revenue data for specific time period', action: 'Get revenue by period' }
  ],
  default: 'getRevenue',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['analytics'] } },
  options: [
    { name: 'Get TVL', value: 'getTvl', description: 'Get total value locked across all pools', action: 'Get total value locked' },
    { name: 'Get Volume Stats', value: 'getVolumeStats', description: 'Get trading volume statistics', action: 'Get trading volume statistics' }
  ],
  default: 'getTvl',
},
// No additional parameters needed for these operations,
// No additional parameters required for governance operations,
{
  displayName: 'Period',
  name: 'period',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['rewards'], 
      operation: ['getRevenueByPeriod'] 
    } 
  },
  default: '',
  description: 'Time period for revenue data (e.g., weekly, monthly, quarterly)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'pools':
        return [await executePoolsOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'governance':
        return [await executeGovernanceOperations.call(this, items)];
      case 'rewards':
        return [await executeRewardsOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executePoolsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('convexfinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCurveApys': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/curve-apys`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCvxApy': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/cvx-apy`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeStakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('convexfinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCvxSupply': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/cvx-supply`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPlatformFees': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/platform-fees`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeGovernanceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('convexfinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getVlCvxData': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vlcvx-data`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getVoteData': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vote-data`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeRewardsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('convexfinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getRevenue': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/revenue`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRevenueByPeriod': {
          const period = this.getNodeParameter('period', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/revenue/${period}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAnalyticsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('convexfinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTvl': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/tvl`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVolumeStats': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/volume-stats`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
