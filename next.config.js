module.exports = {
  env: {
    MORALIS_SERVER_URL: process.env.MORALIS_SERVER_URL,
    MORALIS_APPLICATION_ID: process.env.MORALIS_APPLICATION_ID,
  },
  webpack: (config) => {
    const conf = {
      ...config,
      resolve: {
        ...config.resolve,
        aliasFields: ["browser", "server"],
        alias: {
          ...config.resolve.alias,
          fabric: "fabric-pure-browser",
        },
      },
    };
    return conf;
  },
};
