# THIS IS GAULISH

one day it will be a great IO game with users!

## ----------- Environments -----------

### Dev

- **URL**: [gaulish.vercel.app](https://gaulish.vercel.app/)
- **Branch**: [dev](https://github.com/pmaier983/gaulish/tree/dev)

### Prod

- **URL**: [gaulish.io](https://gaulish.io/)
- **Branch**: [main](https://github.com/pmaier983/gaulish/tree/main)

## -------------- NOTES --------------

_NOTE_ We can probably do bigger then this art wise and scale down

- Standard Icons are 24px x 24px
- Ship Type Icons are 32px x 32px (To give more room for detail)

## ------------- TODO List -------------

### High Priority

- [ ] Build MVP and deploy
- [ ] Provide more valuable info in the error messages? (or otherwise figure out debugging)
- [ ] Setup Monitoring & error logging
- [ ] Setup a method for A/B testing
- [ ] Setup Analytics (https://create.t3.gg/en/other-recs#plausible)
- [ ] Setup Stripe
- [ ]
- [ ] Figure out why eslint is not throwing warnings when running next eslint
- [ ] Collect Data on what size screen users are using
- [ ] Transition to https://github.com/anthonyshew/next-auth/blob/main/packages/adapter-drizzle/src/planetscale/index.ts when it is released
- [ ] Plan out User Economy/MVP

### Low Priority

- [ ] Setup i18n? (try again :cry:) (try: https://twitter.com/tomlienard/status/1675512683007705090?s=46&t=AvxOErBZQssdPziieqzO9w - it works in app directory!)(look into https://crowdin.com/)
- [ ] Add the .notNull property back to our schema timestamp table rows when https://github.com/drizzle-team/drizzle-orm/issues/921 fix merges
- [ ] Generate random usernames along the order of "SlowSailor"
- [ ] Setup Github Actions (Build on commit?) (https://www.youtube.com/watch?v=yfBtjLxn_6k)
  - we get this automatically with Vercel. Shift to github only when we want something more verbose.
- [ ] Setup Ad Sense
- [ ] Look into feature flags
- [ ] make Admin a role permission and not just my email...
- [ ] Setup Dark Mode
- [ ] why does clicking "Tab" add a horizontal scroll bar?
- [ ] Improve every Error message (also add error message to all trcp useQuery/useMutations)
- [ ] Remove all the `createdAt?.getDate() ?? 0`
- [ ] Add some indicator to the user that they have no ships!
- [ ] Add visibility strength to ship properties!
- [ ] Consider converting all date fields to ms since epoch
- [ ] Setup a better Icon management system (The Dynamically imports Icon's and doesn't require babel)
- [ ] Handle mobile better? (font resizing, modal management?)
