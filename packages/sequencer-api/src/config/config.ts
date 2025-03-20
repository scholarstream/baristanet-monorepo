import { Config, PrivateConfig } from './types';
import dotenv from 'dotenv';
import { anvil, arbitrumSepolia, baseSepolia } from 'viem/chains';
import {
  createPublicClient,
  http,
  PublicClient,
  WalletClient,
  createWalletClient,
  Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

dotenv.config();

export const ___privateConfig___: PrivateConfig = {
  sequencerPrivateKey: process.env.SEQUENCER_PRIVATE_KEY || '',
};

export const publicConfig: Config = {
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

export const createPublicClientFromChainId = (
  chainId: number,
  rpcUrl: string | undefined = undefined,
): PublicClient => {
  if (chainId === 421614) {
    return createPublicClient({
      chain: arbitrumSepolia,
      transport: http(rpcUrl),
    }) as PublicClient;
  }

  if (chainId === 84532) {
    return createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    }) as PublicClient;
  }

  return createPublicClient({
    chain: anvil,
    transport: http(rpcUrl),
  }) as PublicClient;
};

export const createWalletClientFromChainId = (
  privateKey: string,
  chainId: number,
  rpcUrl: string | undefined = undefined,
): WalletClient => {
  const account = privateKeyToAccount(privateKey as Address);
  if (chainId === 421614) {
    return createWalletClient({
      account,
      chain: arbitrumSepolia,
      transport: http(rpcUrl),
    }) as WalletClient;
  }

  if (chainId === 84532) {
    return createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(rpcUrl),
    }) as WalletClient;
  }

  return createWalletClient({
    account,
    chain: anvil,
    transport: http(rpcUrl),
  }) as WalletClient;
};
