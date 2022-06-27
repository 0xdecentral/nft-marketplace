const path = require("path");

module.exports = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "./src/assets/scss")],
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // eslint-disable-next-line no-param-reassign
        config.ignoreWarnings = [
            {
                message:
                    /(magic-sdk|@walletconnect\/web3-provider|@web3auth\/web3auth)/,
            },
        ];
        return config;
    },
    images: {
        domains: ["assets-cdn.trustwallet.com", "ipfs.infura.io"],
    },
    env: {
        RPC_URL_1: process.env.RPC_URL_1,
        RPC_URL_3: process.env.RPC_URL_3,
        RPC_URL_4: process.env.RPC_URL_4,
        RPC_URL_5: process.env.RPC_URL_5,
        RPC_URL_42: process.env.RPC_URL_42,
    },
};
