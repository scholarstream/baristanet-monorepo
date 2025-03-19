import express, { Request, Response } from 'express';
import { createClientFromChainId, publicConfig } from '../config';
import { Address, parseAbi } from 'viem';

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
      const client = createClientFromChainId(
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
      res.send({
        sequencer: '0x1234',
        signature: '0x5678',
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
