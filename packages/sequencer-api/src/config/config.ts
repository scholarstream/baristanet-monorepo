import { Config, PrivateConfig } from './types';
import dotenv from 'dotenv';

dotenv.config();

export const ___privateConfig___: PrivateConfig = {
  sequencerPrivateKey: process.env.SEQUENCER_PRIVATE_KEY || '',
};

export const config: Config = {
  clearingChainData: {
    chainId: 421614, // arbitrum sepolia
    rpc: 'https://arbitrum-sepolia-rpc.publicnode.com',
    brewHouseAddress: '0xe151fe7360b77973133e2d3d1a0b47a386ba43cf',
  },
  brokerChainData: [
    {
      chainId: 84532, // base sepolia
      rpc: 'https://base-sepolia-rpc.publicnode.com',
      lattePoolAddress: '0x0495f98b412c34526c5135eeff763d56cb31139a',
    },
  ],
};
