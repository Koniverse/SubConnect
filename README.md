# SubConnect
Simple DApp used to test wallets in Dotsama Ecosystem.

![image](https://user-images.githubusercontent.com/11567273/170807399-78fa0f2c-0c45-443a-9573-1c830b524149.png)

This repository also connect with **SubWallet EVM provider** and **MetaMask provider** with idea from [this issue](https://github.com/Koniverse/SubWallet-Extension/issues/235)

## Requirement:
This project require [nodejs](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) before start.

## Available Scripts
In the project directory, you can start work project with these commands:

### `yarn install`
Run to install project dependencies. Wait until all done before use another command.

### `yarn start`
Runs the app in the development mode.\
Open [http://localhost:3333](http://localhost:3333) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build:ui`
Build package to `sub-connect` to `packages/sub-connect/build`.

### `yarn build`
Build `wallet-connect`, `web3-react-subwallet-connector-v6` packages.

## Documentations:
You can find more information about this project with below link:
- [How to project and another DApp interact with Dotsama wallet extensions](https://github.com/Koniverse/SubConnect/wiki/How-to-integrate-SubWallet-and-other-Dotsama-Wallet-to-DApp)
- [How to work with wallets interface, add to support more wallets](https://github.com/Koniverse/SubConnect/blob/master/src/lib/wallets/README.md)
