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
    //
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
