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

export type Config = {
  sequencerPrivateKey: string;
  clearingChainData: ClearingChainData;
  brokerChainData: BrokerChainData[];
};
