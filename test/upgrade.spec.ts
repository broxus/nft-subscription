import { Contract, Address, toNano } from 'locklift';
import { expect } from 'chai';

import { SubscriptionsCollectionAbi, SubscriptionsMarketAbi } from '../build/factorySource';

describe('Upgrade', () => {
  let owner: Address;

  let collection: Contract<SubscriptionsCollectionAbi>;
  let market: Contract<SubscriptionsMarketAbi>;

  before('deploy contracts', async () => {
    await locklift.deployments.fixture();

    owner = locklift.deployments.getAccount('OwnerWallet').account.address;

    collection = locklift.deployments.getContract<SubscriptionsCollectionAbi>('SubscriptionsCollection');
    market = locklift.deployments.getContract<SubscriptionsMarketAbi>('SubscriptionsMarket');
  });

  describe('change default state', () => {
    it('setRates()', async () => {
      const { traceTree } = await locklift.tracing.trace(
        market.methods
          .setRates({ _rates: [[1, { price: '1', duration: '30' }]] })
          .send({ from: owner, amount: toNano(0.5), bounce: true }),
      );

      return expect(traceTree).to.call('setRates').count(1);
    });

    it('setCollection()', async () => {
      const { traceTree } = await locklift.tracing.trace(
        market.methods
          .setCollection({ _collection: collection.address })
          .send({ from: owner, amount: toNano(0.5), bounce: true }),
      );

      return expect(traceTree).to.call('setCollection').count(1);
    });

    it('buy()', async () => {
      const { traceTree } = await locklift.tracing.trace(
        market.methods
          .buy({ callbackId: 123, rateId: 1 })
          .send({ from: owner, amount: toNano(5), bounce: true }),
      );

      return expect(traceTree)
        .to.call('buy').count(1)
        .and.to.call('mintNft').count(1)
        .and.to.emit('NftCreated').count(1);
    });

    it('withdraw()', async () => {
      const { traceTree } = await locklift.tracing.trace(
        market.methods
          .withdraw({ recipient: owner, amount: 1 })
          .send({ from: owner, amount: toNano(5), bounce: true }),
      );

      return expect(traceTree)
        .to.call('withdraw').count(1)
        .and.to.emit('Withdrawal').count(1);
    });
  });

  describe('upgrade()', () => {
    it('should upgrade collection', async () => {
      const NewCollectionCode = locklift.factory.getContractArtifacts('SubscriptionsCollection').code;
      const oldState = await collection
        .getFields()
        .then((fields) => JSON.stringify(fields.fields));

      const { traceTree } = await locklift.tracing.trace(
        collection.methods
          .upgrade({
            _code: NewCollectionCode,
            _remainingGasTo: owner,
          })
          .send({ from: owner, amount: toNano(2), bounce: true }),
      );

      const newState = await collection
        .getFields()
        .then((fields) => JSON.stringify(fields.fields));

      expect(traceTree).to.emit('Upgraded').count(1);
      return expect(newState).to.be.equal(oldState);
    });

    it('should upgrade market', async () => {
      const NewMarketCode = locklift.factory.getContractArtifacts('SubscriptionsMarket').code;
      const oldState = await market
        .getFields()
        .then((fields) => JSON.stringify(fields.fields));

      const { traceTree } = await locklift.tracing.trace(
        market.methods
          .upgrade({
            _code: NewMarketCode,
            _remainingGasTo: owner,
          })
          .send({ from: owner, amount: toNano(2), bounce: true }),
      );

      const newState = await market
        .getFields()
        .then((fields) => JSON.stringify(fields.fields));

      expect(traceTree).to.emit('Upgraded').count(1);
      return expect(newState).to.be.equal(oldState);
    });
  });
});
