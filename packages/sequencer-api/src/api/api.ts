import express, { Request, Response } from 'express';

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
    this.app.get('/solver/:address', (req: Request, res: Response) => {
      res.send({
        address: req.params.address,
        collateralBalance: 0,
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
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
