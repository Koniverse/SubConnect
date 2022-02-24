# SubConnect
A single Web3 provider solution for test all Wallets in Dotsama Ecosystem and blockchains built on Substrate.


![./public/SubConnect.png](./public/SubConnect.png)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3333](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.
### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## How to integrate wallet with DApp
SubWallet, Polkadot{.js} and Talisman extension allow DApp connect with them by public their interaction in object `injectedWeb3` of window browser.
- SubWallet (public with properties `subwallet-js`)
- Polkadot{.js} (public with properties `polkadot-js`)
- Talisman (public with properties `talisman`)
You can open `injectedWeb3` object in chrome devtools

![InjectWeb3DevTools](https://github.com/Koniverse/SubConnect/wiki/images/InjectWeb3DevTools.png)

- Check the activation of extension: 
  - When a wallet extension is active in browser it will modify `window.injectedWeb3` by add its interaction with specify name.
  - Example check SubWallet extension by these code: `window.injectedWeb3 && window.injectedWeb3['subwallet-js']`
- Enable intergate with DApp by method `enable()` of extension interaction object
  ```javascript
  const SubWalletExtension = window.injectedWeb3['subwallet-js']
  const extension = await SubWalletExtension.enable()
  ```
  After run these code extension will show popup confirmation popup to confirm integrate with DApp
- After enable, `extension` variable can contains these object
  - `accounts`: Allow get accounts data with 2 methods `get` `subscribe`.
  - `signer`: Allow to sign data with 2 methods: `signPayload`, `signRaw`.
  - `metadata`: Allow to get additional metadata list with method `get` and add/update with method `provide`.
    
## Use with typescript
If DApp is writen with typescript you need to add package `@polkadot/extension-inject` to your package.json to get extensions interfaces

