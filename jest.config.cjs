// Copyright 2019-2022 @subwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  ...config,
  modulePathIgnorePatterns: [
    ...config.modulePathIgnorePatterns
  ],
  moduleNameMapper: {
    '@subwallet/(wallet-connect|sub-connect)/(.*)$': '<rootDir>/packages/$1/src/$2',
  },
  transform: {
    ...config.transform,
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  testPathIgnorePatterns: [
    '/node_modules/*'
  ],
  testEnvironment: 'jsdom'
};
