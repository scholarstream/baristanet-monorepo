import express, { Request, Response } from 'express';
import {
  ___privateConfig___,
  createPublicClientFromChainId,
  createWalletClientFromChainId,
  publicConfig,
} from '../config';
import { Address, parseAbi, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const brewHouseAbi = parseAbi([
  'function collateral(address) view returns (uint256)',
]);

export class Api {
  public app: express.Application = express();

  constructor() {
    this.app.use(express.json());

    this.setRoute();
  }

  private setRoute() {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to the RESTful API!');
    });

    // GET /solver/{address}
    // { collateral, debt, txHistory }
    this.app.get('/solver/:address', async (req: Request, res: Response) => {
      const { clearingChainData, brokerChainData } = publicConfig;

      // get the clearing chain client
      const client = createPublicClientFromChainId(
        clearingChainData.chainId,
        clearingChainData.rpc,
      );

      // get the address collateral balance
      const solverAddress = req.params.address;
      const collateralBalance = (await client.readContract({
        address: clearingChainData.brewHouseAddress as Address,
        abi: brewHouseAbi,
        functionName: 'collateral',
        args: [solverAddress as Address],
      })) as bigint;

      // get the broker chains
      // mapping(address => mapping(address => uint256)) public borrowed;
      // LattePool.borrowed(solverAddress, tokenAddress) = borrowedAmount
      // need to know the token lp'ed
      // need to add lp function + event
      // for each, get the debt
      res.send({
        address: req.params.address,
        collateralBalance: collateralBalance.toString(),
        debts: [
          { chainId: 421614, token: '0x1234', amount: 100 },
          { chainId: 84532, token: '0x5678', amount: 200 },
        ],
        txHistory: [
          { chainId: 421614, action: 'deposit', amount: 100 },
          { chainId: 84532, action: 'borrow', token: '0x1234', amount: 100 },
          { chainId: 84532, action: 'repay', token: '0x1234', amount: 50 },
        ],
      });
    });

    // POST /borrow
    // data: {
    //     solver:   address,
    //     token:      address,
    //     amount:     uint256,
    // }
    // response: {
    //     sequencer:  address,
    //     signature:  bytes32,
    //     data: {
    //         solver:   address,
    //         token:      address,
    //         amount:     uint256,
    //     }
    //
    //     // deadline:   uint256,
    // }
    this.app.post('/borrow', async (req: Request, res: Response) => {
      const { solver, token, amount } = req.body;
      const { clearingChainData } = publicConfig;
      const { sequencerPrivateKey } = ___privateConfig___;

      const client = createWalletClientFromChainId(
        sequencerPrivateKey,
        clearingChainData.chainId,
        clearingChainData.rpc,
      );

      const [sequencerAddress] = await client.getAddresses();

      res.send({
        sequencer: sequencerAddress,
        signature:
          '0xa461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b',
        data: {
          solver,
          token,
          amount,
        },
      });
    });
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
