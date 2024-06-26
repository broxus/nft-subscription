import { toNano } from 'locklift';

export default async (): Promise<void> => {
  const owner = locklift.deployments.getAccount('OwnerWallet');

  await locklift.deployments.deploy({
    deployConfig: {
      contract: 'SubscriptionsMarket',
      publicKey: owner.signer.publicKey,
      initParams: {},
      constructorParams: {
        _owner: owner.account.address,
      },
      value: toNano(2),
    },
    deploymentName: 'SubscriptionsMarket',
    enableLogs: true,
  });
};

export const tag = 'subscriptions-market';

export const dependencies = ['owner-wallet'];
