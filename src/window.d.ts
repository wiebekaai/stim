interface Window {
  Shopify: {
    routes: {
      root: string;
    };
  };
  // process.env
  process: {
    env: {
      NODE_ENV: string;
      SHOPIFY_API_KEY: string;
    };
  };
}

declare var process: {
  env: {
    NODE_ENV: 'production' | undefined;
  };
};
