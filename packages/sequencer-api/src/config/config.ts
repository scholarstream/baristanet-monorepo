import { Config } from './types';
import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
  sequencerPrivateKey: process.env.SEQUENCER_PRIVATE_KEY || '',
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
