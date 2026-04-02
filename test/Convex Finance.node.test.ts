/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ConvexFinance } from '../nodes/Convex Finance/Convex Finance.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ConvexFinance Node', () => {
  let node: ConvexFinance;

  beforeAll(() => {
    node = new ConvexFinance();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Convex Finance');
      expect(node.description.name).toBe('convexfinance');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Pools Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://www.convexfinance.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get curve APYs successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCurveApys');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      apyData: [{ pool: 'test-pool', apy: 5.5 }]
    });

    const result = await executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { apyData: [{ pool: 'test-pool', apy: 5.5 }] },
      pairedItem: { item: 0 }
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://www.convexfinance.com/api/curve-apys',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-key'
      },
      json: true
    });
  });

  it('should get CVX APY successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCvxApy');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      cvxApy: 12.5
    });

    const result = await executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { cvxApy: 12.5 },
      pairedItem: { item: 0 }
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://www.convexfinance.com/api/cvx-apy',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-key'
      },
      json: true
    });
  });

  it('should handle API errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCurveApys');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCurveApys');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://www.convexfinance.com' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getCvxSupply', () => {
    it('should get CVX supply data successfully', async () => {
      const mockResponse = { totalSupply: '100000000', circulating: '95000000' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getCvxSupply');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/cvx-supply',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle CVX supply fetch error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getCvxSupply');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getPlatformFees', () => {
    it('should get platform fees successfully', async () => {
      const mockResponse = { stakingFee: '0.17', callIncentive: '0.01' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getPlatformFees');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/platform-fees',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle platform fees fetch error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getPlatformFees');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Network Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Governance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://www.convexfinance.com/api' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getVlCvxData operation', () => {
    it('should get vlCVX data successfully', async () => {
      const mockResponse = { vlcvx: { totalSupply: '1000000', votingPower: '750000' } };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVlCvxData');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/vlcvx-data',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getVlCvxData errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVlCvxData');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getVoteData operation', () => {
    it('should get vote data successfully', async () => {
      const mockResponse = { votes: { totalVotes: '500000', activeProposals: 5 } };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVoteData');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/vote-data',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getVoteData errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVoteData');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Network Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Rewards Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://www.convexfinance.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getRevenue operation', () => {
    it('should get revenue data successfully', async () => {
      const mockResponse = { 
        totalRevenue: 1000000,
        rewardDistribution: { cvx: 500000, crv: 500000 },
        period: 'current'
      };
      
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getRevenue');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/revenue',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getRevenue error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getRevenue');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getRevenueByPeriod operation', () => {
    it('should get revenue by period successfully', async () => {
      const mockResponse = { 
        revenue: 250000,
        period: 'weekly',
        startDate: '2024-01-01',
        endDate: '2024-01-07'
      };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRevenueByPeriod')
        .mockReturnValueOnce('weekly');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/revenue/weekly',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getRevenueByPeriod error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRevenueByPeriod')
        .mockReturnValueOnce('invalid');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid period'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRewardsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid period');
    });
  });
});

describe('Analytics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://www.convexfinance.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTvl operation', () => {
    it('should get TVL successfully', async () => {
      const mockTvlData = { totalValueLocked: '1000000000', lastUpdated: '2023-01-01T00:00:00Z' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTvl');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTvlData);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/tvl',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockTvlData, pairedItem: { item: 0 } }]);
    });

    it('should handle getTvl error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTvl');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getVolumeStats operation', () => {
    it('should get volume stats successfully', async () => {
      const mockVolumeData = { dailyVolume: '50000000', weeklyVolume: '300000000' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVolumeStats');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockVolumeData);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.convexfinance.com/api/volume-stats',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockVolumeData, pairedItem: { item: 0 } }]);
    });

    it('should handle getVolumeStats error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVolumeStats');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Network Error' }, pairedItem: { item: 0 } }]);
    });
  });
});
});
