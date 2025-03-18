export type ClearingChainData = {
  chainId: number;
  rpc: string;
  brewHouseAddress: string;
};

export type BrokerChainData = {
  chainId: number;
  rpc: string;
  lattePoolAddress: string;
};

export type PrivateConfig = {
  sequencerPrivateKey: string;
};

export type Config = {
  clearingChainData: ClearingChainData;
  brokerChainData: BrokerChainData[];
};
