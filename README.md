# AdaPools Yoroi Frontend

This project wraps [AdaPools](https://adapools.org/) in a UI for usage in Yoroi.

## Available Scripts

- `npm start` run in dev mode (hot reload)
- `npm test` run tests (hot reload)
- `npm run build` builds production build

## How to use

This project is meant to be embedded inside an `iframe` in Yoroi. It will use `postMessage` to pass back the user's selected pool

Accepted GET parameters:

- `chromeID` the ID of the Chrome extension that is hosting this iframe. Used to know which tab to pass the `postMessage` response to
- `mozId` the ID of the Firefox extension that is hosting this iframe. Used to know which tab to pass the `postMessage` response to
- `selectedPoolIds` the user's currently delegated pools. We use this to gray out the already selected pools (so the user doesn't re-delegate to a pool they're already delegating to)
- `lang` the language to display
- `source` this can be one of the following possibilities: `chrome`, `firefox`, `mobile`. Note: `mobile` only works for React Native mobile sources

Return type

```
Array<{|
  poolHash: string,
|}>
```

## Why not embed AdaPools directly instead of a wrapper

- Allows us to match the look-and-feel of Yoroi
- Allows us to make any code change without waiting on AdaPools developers
- Reduces the amount of user information shared with AdaPools

## How do we keep this secure?

1) We use a CSP policy so that any dependency being hacked can't communicate with 3rd parties
2) This page SHOULD be embedded inside a sandboxed iframe to mitigate any Yoroi information being accessible to this website
3) This page only returns pool ids. Yoroi SHOULD use a separate backend to fetch the pool name for the given IDs to confirm with the user it is the correct pool
