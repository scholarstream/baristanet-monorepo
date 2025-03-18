import { Config } from './types';

export const config: Config = {
  clearingChainData: {
    chainId: 1337,
    rpc: 'http://localhost:8545',
    brewHouseAddress: '0x...',
  },
  brokerChainData: [
    {
      chainId: 1337,
      rpc: 'http://localhost:8545',
      lattePoolAddress: '0x...',
    },
    {
      chainId: 1337,
      rpc: 'http://localhost:8545',
      lattePoolAddress: '0x...',
    },
  ],
};
