# Starter

Based on [Dawn](https://github.com/Shopify/dawn), heavily inspired by [Hydrogen Theme](https://github.com/montalvomiguelo/hydrogen-theme).

## Development

### Commands

#### Install dependencies

```
npm i
```

#### Start development server

```
npm run dev
```

#### Create preview theme

```
npm run preview -- --theme=[branch_name]
```

## Deployment

1. Create a `store/store_name` branch and connect it with the [Shopify GitHub integration](https://shopify.dev/docs/themes/tools/github).
1. Set up a GitHub Action to keep `store/store_name` up to date with `main`

   - Use [Create pull request](https://github.com/marketplace/actions/create-pull-request) to [keep a branch up-to-date with another](https://github.com/peter-evans/create-pull-request/blob/main/docs/examples.md#keep-a-branch-up-to-date-with-another)
   - Bundle assets with `npm ci && npm run build`
   - Use [Add & Commit](https://github.com/marketplace/actions/add-commit) to commit bundled assets

> 💥 Don't commit template or content changes to `main`, this will cause conflicts when merging.

## Considerations

- For the best developer experience, we use [Shopify Vite Plugin](https://github.com/barrel/shopify-vite/tree/main/packages/vite-plugin-shopify) to bundle assets during development. If maintenance of this plugin stops, we can discard the generated snippet it uses and simply use Vite to bundle assets.
