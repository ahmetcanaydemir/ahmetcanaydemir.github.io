# [ahmetcanaydemir.com](https://ahmetcanaydemir.com/)

My personal website. Forked from [Dan Abramov](https://github.com/gaearon)'s [overreacted.io](https://github.com/gaearon/overreacted.io).

To run locally, `yarn`, then `yarn dev`, then open https://localhost:8000.

## Contributing Translations

You can translate any article on the website into your language!

Add a Markdown file with the translation to the corresponding article folder. For example `index.fr.md` in `src/pages/optimized-for-change/`.

If you're the first one to translate a post to your language, you'll need to add it to to the list in `./i18n.js`. See [this PR](https://github.com/gaearon/overreacted.io/pull/159) for an example. If your language needs special font characters, add it to the appropriate place in [this list](https://github.com/gaearon/overreacted.io/blob/5de6c128f798506a54a1a34c32cd5446beecc272/src/utils/i18n.js#L15).
