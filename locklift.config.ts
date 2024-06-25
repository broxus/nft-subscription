import { LockliftConfig, lockliftChai } from "locklift";
import { FactorySource } from "./build/factorySource";
import '@broxus/locklift-verifier';
import { Deployments } from '@broxus/locklift-deploy';
import * as dotenv from 'dotenv';

dotenv.config();

import chai from 'chai';
chai.use(lockliftChai);


declare module 'locklift' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  export interface Locklift {
    deployments: Deployments<FactorySource>;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const locklift: import('locklift').Locklift<FactorySource>;
}


const config: LockliftConfig = {
  compiler: {
    // Specify path to your TON-Solidity-Compiler
    // path: "/mnt/o/projects/broxus/TON-Solidity-Compiler/build/solc/solc",

    // Or specify version of compiler
    version: "0.62.0",

    externalContractsArtifacts: {
      "node_modules/@broxus/tip4/precompiled": ['Index', 'IndexBasis']
    }
  },
  linker: {
    // Specify path to your stdlib
    // lib: "/mnt/o/projects/broxus/TON-Solidity-Compiler/lib/stdlib_sol.tvm",
    // // Specify path to your Linker
    // path: "/mnt/o/projects/broxus/TVM-linker/target/release/tvm_linker",

    // Or specify version of linker
    version: "0.15.48",
  },
  networks: {
    locklift: {
      giver: {
        address: '0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415',
        key: '172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3',
      },
      connection: {
        id: 1001,
        type: "proxy",
        // @ts-ignore
        data: {}
      },
      keys: {
        phrase: 'action inject penalty envelope rabbit element slim tornado dinner pizza off blood',
        amount: 20,
      },
    },
    // venom_mainnet: {
    //   connection: {
    //     id: 1,
    //     type: 'jrpc',
    //     group: 'main',
    //     data: {
    //       endpoint: process.env.VENOM_MAINNET_RPC_NETWORK_ENDPOINT ?? '',
    //     },
    //   },
    //   giver: {
    //     address: process.env.VENOM_MAINNET_GIVER_ADDRESS ?? '',
    //     phrase: process.env.VENOM_MAINNET_GIVER_PHRASE ?? '',
    //     accountId: 0,
    //   },
    //   keys: {
    //     phrase: process.env.VENOM_MAINNET_PHRASE,
    //     amount: 100,
    //   },
    // }
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
