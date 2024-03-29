# THIS IS GAULISH

one day it will be a great IO game with users!

PUT on HIATUS starting Jan 19th 2024

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

- Soft Cap of 16 384 spites (https://github.com/pixijs/pixijs/issues/91)

## ------------- TODO List -------------

### High Priority

- [ ] Provide more valuable info in the error messages? (or otherwise figure out debugging)
- [ ] Setup Monitoring & error logging
- [ ] Setup a method for A/B testing
- [ ] Setup Analytics (https://create.t3.gg/en/other-recs#plausible) (https://youtu.be/6xXSsu0YXWo?si=zy2NbvT3jvLkEJhv) (Also explore outside of T3 ecosystem just in case)
- [ ] Setup Stripe (https://github.com/juliusmarminge/acme-corp/tree/main/packages/stripe/src)
- [ ] Figure out why eslint is not throwing warnings when running next eslint
- [ ] Collect Data on what size screen users are using
- [ ] Setup an error page (/\_error?)
- [ ] pre-release checklist https://vercel.com/docs/production-checklist

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
- [ ] Add visibility strength to ship properties!
- [ ] Consider converting all date fields to ms since epoch
- [ ] Setup a better Icon management system (The Dynamically imports Icon's and doesn't require babel)
- [ ] Handle mobile better? (font resizing, modal management?)
- [ ] Setup some indication of price updates
- [ ] Polish all the log messages
- [ ] Setup a proper Pixi loading screen
- [ ] Give LunarRaid (pixi.js guy) some special something? A custom ship or idk what?
- [ ] Consider Shifting over to Stylex (https://github.com/facebook/stylex)

### MVP Requirements

- [ ] Map Creator
- [ ] Initial User Setup
- [ ] Fix Bugs
  - [ ] Setup a reliable spawn and new player system (Map Visibility and Cities Choice)
  - [ ] Setup Ship <-> Ship interaction
  - [ ] Setup a way to get cash
  - [ ] Fix the begging functionality
  - [ ] Multiple Ships now gaining visible land at the same time
