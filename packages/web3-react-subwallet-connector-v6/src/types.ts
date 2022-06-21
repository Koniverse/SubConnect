// Copyright 2019-2022 @subwallet/web3-react-subwallet-connector-v6 authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type RequestResponse = any

export type Request = (args: {method: string, params?: any[]}) => Promise<RequestResponse>
