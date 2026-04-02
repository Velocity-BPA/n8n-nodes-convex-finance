import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ConvexFinanceApi implements ICredentialType {
	name = 'convexFinanceApi';
	displayName = 'Convex Finance API';
	description = 'Convex Finance API credentials';
	properties: INodeProperties[] = [
		{
			displayName = 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://www.convexfinance.com/api',
			description: 'The base URL for the Convex Finance API',
		},
	];
}