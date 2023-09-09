interface Window {
  process: {
    env: {
      NODE_ENV: string;
    };
  };

  routes: {
    cart_add_url: string;
    cart_change_url: string;
    cart_update_url: string;
    cart_url: string;
    predictive_search_url: string;
  };
}

declare var process: {
  env: {
    NODE_ENV: 'production' | undefined;
  };
};
