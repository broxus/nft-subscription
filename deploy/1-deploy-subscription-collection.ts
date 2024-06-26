import { toNano, getRandomNonce } from 'locklift';

import { Collection } from '../assets/collection';

export default async (): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');
  const market = locklift.deployments.getContract('SubscriptionsMarket');

  const IndexCode = locklift.factory.getContractArtifacts('Index').code;
  const IndexBasisCode = locklift.factory.getContractArtifacts('IndexBasis').code;
  const NftCode = locklift.factory.getContractArtifacts('SubscriptionNft').code;

  await locklift.deployments.deploy({
    deployConfig: {
      contract: 'SubscriptionsCollection',
      publicKey: owner.signer.publicKey,
      initParams: { nonce_: getRandomNonce() },
      constructorParams: {
        codeNft: NftCode,
        codeIndex: IndexCode,
        codeIndexBasis: IndexBasisCode,
        owner: owner.account.address,
        managers: [market.address],
        remainOnNft: toNano(1),
        json: JSON.stringify(Collection),
      },
      value: toNano(2),
    },
    deploymentName: 'SubscriptionsCollection',
    enableLogs: true,
  });
};

export const tag = 'subscriptions-collection';

export const dependencies = ['owner-wallet', 'subscriptions-market'];
