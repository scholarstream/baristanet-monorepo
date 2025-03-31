import { fillIntent, openIntent, settleIntent } from './actions';
import { addressToBytes32, bytes32ToAddress } from './utils';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

const addr0 = '0x576ba9ea0dc68f8b18ff8443a1d0aa1425459ef5';
const addr1 = addressToBytes32(addr0);
const addr2 = bytes32ToAddress(addr1);

async function main() {
  const isOpen = args._.includes('open');
  const isFill = args._.includes('fill');
  const isSettle = args._.includes('settle');

  if (isOpen) await openIntent();
  if (isFill) await fillIntent();
  if (isSettle) await settleIntent();
}

main();
