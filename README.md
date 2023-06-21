# THIS IS GAULISH

one day it will be a great IO game with users!

## ----------- Environments -----------

### Dev

- **URL**: [gaulish.vercel.app](https://gaulish.vercel.app/)
- **Branch**: [dev](https://github.com/pmaier983/gaulish/tree/dev)

### Prod

- **URL**: [gaulish.io](https://gaulish.io/)
- **Branch**: [main](https://github.com/pmaier983/gaulish/tree/main)

## ------------- TODO List -------------

### High Priority

- [ ] Setup Monitoring & error logging
- [ ] Setup Analytics (https://create.t3.gg/en/other-recs#plausible)
- [ ] Setup Stripe
- [ ] Setup websockets (https://create.t3.gg/en/other-recs#pusher)
  - [ ] Compare https://socket.io/ and https://partykit.io/
- [ ] Plan MVP Components
  - [ ] How to do Infinite Canvas
    - Playground (Semi close) -> https://www.pixiplayground.com/#/edit/B8R6ZZD8JROtw1c52LFnN
    - Pure Canvas solution -> https://github.com/emilefokkema/infinite-canvas
    - Pure React infinite Canvas -> https://betterprogramming.pub/how-to-create-a-figma-like-infinite-canvas-in-react-a2b0365b2a7
  - [ ] Components an infinite canvas solution needs to have:
    - P0 drag to move
    - P0 scroll wheel zoom
    - P1 drag and drop to path functionality
    - P2 pinch to zoom
    - P2 a nice interaction at the edges
- [ ] Plan MVP Backend (SQL relationships)
- [ ] Build MVP and deploy
- [ ] Core User Journey
  - [ ] Sailing
    - [ ] Sketch it out in https://excalidraw.com/ (ONLY MVP)
    - Ship Selection
    - User plans a route
      - P0 arrow keys to nav
      - P2 drag and drop
      - P2 Select city to auto nav (A* pathing https://en.wikipedia.org/wiki/A*\_search_algorithm)

### Low Priority

- [ ] Setup i18n? (try again :cry:) (look into https://crowdin.com/)
- [ ] Setup Github Actions (Build on commit?)
  - we get this automatically with Vercel. Shift to github only when we want something more verbose.
- [ ] Setup Ad Sense
- [ ] Look into feature flags
- [ ] Setup Component library (https://www.radix-ui.com/)
