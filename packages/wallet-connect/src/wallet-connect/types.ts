export interface ChainData {
  name: string;
  id: string;
  testnet: boolean;
}

export interface ChainsMap {
  [reference: string]: ChainData;
}

export interface ChainMetadata {
  name: string;
  logo: string;
}

export interface NamespaceMetadata {
  [reference: string]: ChainMetadata;
}

export interface ChainRequestRender {
  label: string;
  value: string;
}

export interface JsonRpcProviderMessage<T = any> {
  type: string;
  data: T;
}
export interface RequestArguments<T = any> {
  method: string;
  params?: T;
  id?: number;
}
export interface JsonRpcRequest<T = any> extends Required<RequestArguments<T>> {
  id: number;
  jsonrpc: string;
}
export interface JsonRpcResult<T = any> {
  id: number;
  jsonrpc: string;
  result: T;
}
export interface JsonRpcError {
  id: number;
  jsonrpc: string;
  error: ErrorResponse;
}
export interface ErrorResponse {
  code: number;
  message: string;
  data?: string;
}
export type JsonRpcResponse<T = any> = JsonRpcResult<T> | JsonRpcError;
export type JsonRpcPayload<P = any, R = any> = JsonRpcRequest<P> | JsonRpcResponse<R>;
//# sourceMappingURL=jsonrpc.d.ts.map
