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
        },
      },
    };
    return conf;
  },
  async redirects() {
    return [
      {
        source: '/dao',
        destination: 'https://mango-puck-2f0.notion.site/Realms-DAO-4db97df04c8f4cf8a5e163abff56e266',
        permanent: true,
      },
    ]
  },
};
