# HyprActive Client Service

## Getting Started

Setup instructions that applies across multiple repos can be
found [here](https://app.nuclino.com/Hypr/Capability-Uplift-Program/Generic-Set-Up-f18315f8-86c6-4365-bdb8-e6803db45be3)

## Definition of Done (feature)

Definition of Done can be
found [here](https://app.nuclino.com/Hypr/Capability-Uplift-Program/Definition-of-Done-4997b47c-a170-4db4-b0d6-ed461c0868ca)

## Start the Dev Server

```bash
npm run docker:dev:up # Run this on the host. Start the docker containers
npm run docker:dev:connect # Run this on the host. Connect to the api container's shell
npm ci # Run this in the container. Install deps without update the lock file
npm run db:init # Run this in the container. Create tables
npm run db:seed #Run this in the container. Creates seed data (two entries)
```

```bash
npm run dev # Run this in the container.
```

## Infrastructure as Code

See the documentation [here](./.infra/README.md).





