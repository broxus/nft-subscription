import { toNano, Address } from 'locklift';
import { expect } from 'chai';
import prompts from 'prompts';

import { SubscriptionsCollectionAbi } from '../build/factorySource';

const main = async (
  recipient: string,
  expireAt: Date,
  count: number
): Promise<Address[]> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');
  const collection = locklift.deployments.getContract<SubscriptionsCollectionAbi>('SubscriptionsCollection');

  const { traceTree } = await locklift.tracing.trace(
    collection.methods
      .batchMintNft({
        _recipient: new Address(recipient),
        _expireAt: Math.floor(expireAt.getTime() / 1000),
        _rateId: 0,
        _mintCount: count,
        _offset: 0,
        _remainingGasTo: owner.account.address,
      })
      .send({
        from: owner.account.address,
        amount: toNano(count * 3),
        bounce: true,
      }),
  );

  expect(traceTree).to.emit('NftCreated').count(count);

  return traceTree!
    .findEventsForContract({ contract: collection, name: 'NftCreated' as const })
    .map((a) => a.nft);
};

prompts([
  { type: 'text', name: 'recipient', message: 'Recipient' },
  { type: 'date', name: 'expireAt', message: 'Expire at', mask: 'DD-MM-YYYY HH:mm:ss' },
  { type: 'number', name: 'count', message: 'Count' },
])
  .then((res) => main(res.recipient, res.expireAt, res.count))
  .then((nfts) => console.log(`Minted: ${JSON.stringify(nfts, null, 2)}`))
  .catch((err) => console.error(err));
