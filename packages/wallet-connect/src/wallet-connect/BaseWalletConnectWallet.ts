// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getRequiredNamespaces, isSameAddress } from "./helpers";
import {
  WalletConnectRequestArguments,
  WalletConnectWallet,
  WalletConnectWalletInfo,
  WalletLogoProps
} from '@subwallet/wallet-connect/types';
import { WALLET_CONNECT_PROJECT_ID } from "@subwallet/wallet-connect/wallet-connect/constants";
import Client from "@walletconnect/sign-client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import { Web3Modal } from "@web3modal/standalone";
import { getSdkError } from "@walletconnect/utils";


const web3Modal = new Web3Modal({
  projectId: WALLET_CONNECT_PROJECT_ID,
  themeMode: "dark",
  walletConnectVersion: 2
});

export class BaseWalletConnectWallet implements WalletConnectWallet {
  extensionName = '';
  logo: WalletLogoProps;
  title: string;
  #client: Client | undefined;
  #session: SessionTypes.Struct | undefined;
  #pairings: PairingTypes.Struct[] = [];
  #pending: boolean = false;
  #accounts: string[] = [];
  #chains: string[] = [];

  constructor({ extensionName, logo, title }: WalletConnectWalletInfo) {
    this.extensionName = extensionName;
    this.logo = logo;
    this.title = title;
  }

  // Init client
  get installed(): boolean {
    return true;
  }

  // Init client
  get isInitializing(): boolean {
    return !!this.#client;
  }

  // Connect with a session
  get isConnected() {
    return !!this.#session;
  }

  async enable(): Promise<boolean> {
    await this.#createClient();
    return true;
  }

  setChains(chains: string[]) {
    this.#chains = chains;
  }

  get pairs() {
    return this.#pairings;
  }

  get accounts() {
    return this.#accounts;
  }

  async disconnect() {
    if (typeof this.#client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof this.#session === "undefined") {
      throw new Error("Session is not connected");
    }

    try {
      await this.#client.disconnect({
        topic: this.#session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    } catch (error) {
      console.error("SignClient.disconnect failed:", error);
    } finally {
      // Reset app state after disconnect.
      this.#reset();
    }
  }

  async ping() {
    if (typeof this.#client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof this.#session === "undefined") {
      throw new Error("Session is not connected");
    }

    let valid = false;

    try {
      this.#setPending(true);
      await this.#client.ping({ topic: this.#session.topic });
      valid = true;
    } catch (e) {
      console.error(e);
    } finally {
      this.#setPending(false);
    }

    return valid;
  }

  async connect(pairing?: any) {
    if (typeof this.#client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    console.log("connect, pairing topic is:", pairing?.topic);
    try {
      const requiredNamespaces = getRequiredNamespaces(this.#chains);
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

  sendRequest<T>(args: WalletConnectRequestArguments): Promise<T> {
    return this.#client!.request<T>({
      request: args.request,
      topic: this.#session!.topic,
      chainId: args.chainId
    })
  }

  createRequestHandler<T>(rpcRequest: (chain: string, address: string) => Promise<T>): ((chainId: string, address: string) => Promise<T>) {
    return async (chain: string, address: string) => {
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
        const caipAccountAddress = `${chain}:${address}`;
        const account = this.#accounts.find(
          (account) => {
            const [namespace, ref, accAddress] = account.split(":");
            const accChain = `${namespace}:${ref}`;
            return isSameAddress(accAddress, address) && accChain === chain;
          }
        );
        if (account === undefined) {
          throw new Error(`Account for ${caipAccountAddress} not found`);
        }

        this.#setPending(false);
        return await rpcRequest(chain, address);
        // setResult(result);
      } catch (err: any) {
        console.error("RPC request failed: ", err);
        this.#setPending(false);
        throw (err as Error);
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

  async #checkPersistedState(_client: Client) {
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
    this.#accounts = Object.values(_session.namespaces)
      .map((namespace) => namespace.accounts)
      .flat();

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
