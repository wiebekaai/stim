# Starter

Based on [Dawn](https://github.com/Shopify/dawn), heavily inspired by [Hydrogen Theme](https://github.com/montalvomiguelo/hydrogen-theme).

## Development

### Install dependencies

```
npm i
```

### Start development server

```
npm run dev
```

### Deploy a preview

```
npm run preview -- --theme=[branch_name]
```

## Deploying to production

1. Create a `store/store_name` branch and connect it with the [Shopify GitHub integration](https://shopify.dev/docs/themes/tools/github).
1. Set up a GitHub Action to keep `store/store_name` up to date with `main`
   - Build `npm ci && npm run build`
   - [Add & Commit](https://github.com/marketplace/actions/add-commit)
   - [eter-evans/create-pull-request](https://github.com/peter-evans/create-pull-request/blob/main/docs/examples.md#keep-a-branch-up-to-date-with-another)

> 💥 Don't commit template or content changes to `main`, this will cause conflicts when merging.
