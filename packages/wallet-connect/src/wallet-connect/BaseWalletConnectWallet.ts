// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MetaMaskInpageProvider } from '@metamask/providers';
import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/types';
import { WalletConnectWallet, WalletConnectWalletInfo, WalletLogoProps } from '@subwallet/wallet-connect/types';
import Client from "@walletconnect/sign-client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import { Web3Modal } from "@web3modal/standalone";
import { getRequiredNamespaces } from '../evm/helper';
import { CHAIN_SUPPORTED, WALLET_CONNECT_PROJECT_ID } from "@subwallet/wallet-connect/evm/constants";

interface IFormattedRpcResponse<T> {
  method?: string;
  address?: string;
  valid: boolean;
  result: T;
}

const web3Modal = new Web3Modal({
  projectId: WALLET_CONNECT_PROJECT_ID,
  themeMode: "dark",
  walletConnectVersion: 2
});

export class BaseWalletConnectWallet implements WalletConnectWallet {
  extensionName = '';
  installUrl = '';
  logo: WalletLogoProps;
  title: string;
  initEvent?: string;
  #client: Client | undefined;
  #session: SessionTypes.Struct | undefined;
  #pairings: PairingTypes.Struct[] = [];
  #pending: boolean = false;
  #accounts: string[] = []

  constructor({ extensionName, logo, title }: WalletConnectWalletInfo) {
    this.extensionName = extensionName;
    this.logo = logo;
    this.title = title;
  }

  get extension() {
    if (this.#client) {
      const result = this.#client as unknown as MetaMaskInpageProvider;
      result.isConnected = () => true;
      return result;
    } else {
      return undefined
    }
  }

  get installed(): true {
    return true;
  }

  async enable(): Promise<boolean> {
    await this.#createClient();
    if (!this.#pairings.length) {
      await this.connect();
    }
    return true;
  }

  #handleRequest<T>(args: RequestArguments) {
    console.log(args);

    switch (args.method) {
      case 'eth_chainId':
        return '504' as unknown as T;
      case 'eth_accounts':
        return this.#accounts as unknown as T;
    }

    return null;
  }

  async request<T>(args: RequestArguments): Promise<Maybe<T>> {
    if (typeof this.#client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }

    let rs: Maybe<T> = this.#handleRequest<T>(args);

    if (rs !== null) {
      return Promise.resolve(rs)
    }

    return new Promise(async (resolve) => {
      await this.#createJsonRpcRequestHandler(async (chainId, address) => {

        try {
          rs = await this.#client!.request<T>({
            request: {
              method: args.method,
              params: args.params
            },
            chainId: chainId,
            topic: this.#session!.topic
          })

          console.log('123123123', rs)

          return {
            method: args.method,
            address,
            valid: true,
            result: rs,
          };
        }catch (e) {
          console.log(e)
          throw e as Error;
        }

      })('eip155:1284', this.#accounts[0]);

      resolve(rs);
    })
  }

  async connect(pairing?: any) {
    if (typeof this.#client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    console.log("connect, pairing topic is:", pairing?.topic);
    try {
      const requiredNamespaces = getRequiredNamespaces(CHAIN_SUPPORTED.map((chainId) => `eip155:${chainId}`));
      console.log(
        "requiredNamespaces config for connect:",
        requiredNamespaces
      );

      const { uri, approval } = await this.#client.connect({
        pairingTopic: pairing?.topic,
        requiredNamespaces,
      });

      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        // Create a flat array of all requested chains across namespaces.
        const standaloneChains = Object.values(requiredNamespaces)
          .map((namespace) => namespace.chains)
          .flat() as string[];

        web3Modal.openModal({ uri, standaloneChains });
      }

      const session = await approval();
      console.log("Established session:", session);
      await this.#onSessionConnected(session);
      // Update known pairings after session is connected.
      this.#pairings = this.#client.pairing.getAll({ active: true });
    } catch (e) {
      console.error(e);
      // ignore rejection
    } finally {
      // close modal in case it was open
      web3Modal.closeModal();
    }
  }

  #reset() {
    this.#session = undefined;
    this.#accounts = [];
  };

  #setPending(val: boolean) {
    this.#pending = val;
  }

  #createJsonRpcRequestHandler<T>(rpcRequest: (chainId: string, address: string) => Promise<IFormattedRpcResponse<T>>): ((chainId: string, address: string) => Promise<void>) {
    return async (chainId: string, address: string) => {
      if (typeof this.#client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      if (typeof this.#session === "undefined") {
        throw new Error("Session is not connected");
      }
      if (this.#pending) {
        throw new Error("Have a pending request");
      }

      try {
        this.#setPending(true);
        const result = await rpcRequest(chainId, address);
        console.log('success', result);
        // setResult(result);
        this.#setPending(false);
      } catch (err: any) {
        console.log('error', err);
        console.error("RPC request failed: ", err);
        // setResult({
        //   address,
        //   valid: false,
        //   result: err?.message ?? err,
        // });
        this.#setPending(false);
      } finally {
        console.log('finally', 123123123)
      }
    };
  }


  async #createClient() {
    try {
      const _client = await Client.init({
        logger: 'debug',
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: 'My Dapp',
          description: 'My Dapp description',
          url: 'https://my-dapp.com',
          icons: ['https://my-dapp.com/logo.png']
        },
      });

      this.#client = _client;

      await this.#subscribeToEvents(_client);
      await this.#checkPersistedState(_client);
    } catch (err) {
      throw err;
    } finally {
      // setIsInitializing(false);
    }
  }

  async #subscribeToEvents(_client: Client) {
    if (typeof _client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }

    _client.on("session_ping", (args) => {
      console.log("EVENT", "session_ping", args);
    });

    _client.on("session_event", (args) => {
      console.log("EVENT", "session_event", args);
    });

    _client.on("session_update", ({ topic, params }) => {
      console.log("EVENT", "session_update", { topic, params });
      const { namespaces } = params;
      const _session = _client.session.get(topic);
      const updatedSession = { ..._session, namespaces };
      this.#onSessionConnected(updatedSession);
    });

    _client.on("session_delete", () => {
      console.log("EVENT", "session_delete");
      this.#reset();
    });
  }

  async #checkPersistedState(_client: Client)  {
    if (typeof _client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    // populates existing pairings to state
    this.#pairings = _client.pairing.getAll({ active: true });

    console.log("RESTORED PAIRINGS: ", this.#pairings);

    if (typeof this.#session !== "undefined") return;
    // populates (the last) existing session to state
    if (_client.session.length) {
      const lastKeyIndex = _client.session.keys.length - 1;
      const _session = _client.session.get(
        _client.session.keys[lastKeyIndex]
      );
      console.log("RESTORED SESSION:", _session);
      await this.#onSessionConnected(_session);
      return _session;
    }

    return undefined;
  }

  async #onSessionConnected(_session: SessionTypes.Struct) {
    const allNamespaceAccounts = Object.values(_session.namespaces)
    .map((namespace) => namespace.accounts)
    .flat();

    const accountMap: Record<string, string> = {};
    allNamespaceAccounts.forEach((nameSpaceAccount) => {
      const [, , accountAddress] = nameSpaceAccount.split(':');
      accountMap[accountAddress] = accountAddress
    })
    // const allNamespaceChains = Object.keys(_session.namespaces);

    this.#accounts = Object.keys(accountMap);

    this.#session = _session;
    // setChains(allNamespaceChains);
    // setAccounts(allNamespaceAccounts);
  }

  // addProvider (provider: any): void {
  // }
  //
  // on (event: string, handler: () => void): void {
  // }
  //
  // send (payload: JSONRPCRequestPayload): void {
  // }
  //
  // sendAsync (payload: JSONRPCRequestPayload, callback: (error: (Error | null), response: JSONRPCResponsePayload) => void): void;
  // sendAsync (payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
  // sendAsync (payload: JSONRPCRequestPayload, callback: ((error: (Error | null), response: JSONRPCResponsePayload) => void) | JSONRPCErrorCallback): void {
  // }
  //
  // start (callback?: () => void): void {
  // }
  //
  // stop (): void {
  // }
}
