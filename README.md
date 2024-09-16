# Web3 transaction speed checker NFT contracts

This project contains the NFT used at: https://speedchecker.paintswap.io

[![Continuous integration](https://github.com/PaintSwap/speedchecker-contracts/actions/workflows/main.yml/badge.svg)](https://github.com/PaintSwap/speedchecker-contracts/actions/workflows/main.yml)

To start copy the .env.sample file to .env and fill in PRIVATE_KEY at minimum, starts with 0x

```shell
yarn install

# To compile the contracts
yarn compile

# To run the tests
yarn test

# To deploy all contracts
yarn deploy --network <network>
yarn deploy --network fantom_testnet

# Export abi
yarn abi
```
