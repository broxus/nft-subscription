import { toNano, Address } from 'locklift';
import { expect } from 'chai';
import prompts from 'prompts';

import { SubscriptionsMarketAbi } from '../build/factorySource';

const main = async (recipient: string, amount: string): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');
  const market = locklift.deployments.getContract<SubscriptionsMarketAbi>('SubscriptionsMarket');

  const { traceTree } = await locklift.tracing.trace(
    market.methods
      .withdraw({
        recipient: new Address(recipient),
        amount: amount,
      })
      .send({
        from: owner.account.address,
        amount: toNano(2),
        bounce: true,
      }),
  );

  expect(traceTree).to.emit('Withdrawal').count(1);
};

prompts([
  { type: 'text', name: 'recipient', message: 'Recipient' },
  { type: 'text', name: 'amount', message: 'Amount' },
])
  .then((res) => main(res.recipient, res.amount))
  .then((nfts) => console.log('Success'))
  .catch((err) => console.error(err));
