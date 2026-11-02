# Paradise documentation

Documentation is the source of truth for what Paradise is, what exists, and
what is planned. Keep it accurate; update it in the same change as the code.

## Status vocabulary

Every feature or capability is described with exactly one of:

| Status | Meaning |
| --- | --- |
| **Planned** | Designed or intended. No code yet. |
| **Implemented** | Code exists in the repository. Not yet verified by an executed test. |
| **Tested** | Automated tests covering it were run and passed (record where and when). |
| **Released** | Deployed to production and reachable by users. |

Nothing is Released yet. See [CURRENT_STATUS.md](CURRENT_STATUS.md).

## Map

- Start here: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) · [VISION.md](VISION.md) ·
  [ROADMAP.md](ROADMAP.md) · [CURRENT_STATUS.md](CURRENT_STATUS.md) ·
  [CHANGELOG.md](CHANGELOG.md) · [GLOSSARY.md](GLOSSARY.md)
- **architecture/** — how the system is built:
  [SYSTEM_OVERVIEW](architecture/SYSTEM_OVERVIEW.md) · [TECH_STACK](architecture/TECH_STACK.md) ·
  [DIRECTORY_STRUCTURE](architecture/DIRECTORY_STRUCTURE.md) · [DATABASE_DESIGN](architecture/DATABASE_DESIGN.md) ·
  [AUTHENTICATION](architecture/AUTHENTICATION.md) · [AUTHORIZATION](architecture/AUTHORIZATION.md) ·
  [SECURITY](architecture/SECURITY.md) · [GEOSPATIAL](architecture/GEOSPATIAL.md) ·
  [DATA_LIFECYCLE](architecture/DATA_LIFECYCLE.md) · [CLOUDFLARE_ARCHITECTURE](architecture/CLOUDFLARE_ARCHITECTURE.md)
- **features/** — per-ecosystem behaviour:
  [network](features/network/OVERVIEW.md) · [exchange](features/exchange/OVERVIEW.md) ·
  [business](features/business/OVERVIEW.md) · [marketing](features/marketing/OVERVIEW.md) ·
  [apprenticeships](features/apprenticeships/MAESTRO_INTEGRATION.md)
- **product/** — [USER_JOURNEYS](product/USER_JOURNEYS.md) · [DESIGN_SYSTEM](product/DESIGN_SYSTEM.md) ·
  [LANDING_PAGE](product/LANDING_PAGE.md) · [SUCCESS_METRICS](product/SUCCESS_METRICS.md)
- **development/** — [SETUP](development/SETUP.md) · [CODING_STANDARDS](development/CODING_STANDARDS.md) ·
  [TESTING](development/TESTING.md) · [DEPLOYMENT](development/DEPLOYMENT.md) ·
  [CLOUDFLARE_DEPLOYMENT](development/CLOUDFLARE_DEPLOYMENT.md) ·
  [ENVIRONMENT_VARIABLES](development/ENVIRONMENT_VARIABLES.md) · [KNOWN_ISSUES](development/KNOWN_ISSUES.md) ·
  [NEXT_STEPS](development/NEXT_STEPS.md)
- **decisions/** — [architecture decision records](decisions/README.md)
- **milestones/** — [01 Foundation](milestones/MILESTONE_01_FOUNDATION.md) ·
  [02 Network](milestones/MILESTONE_02_NETWORK.md) · [03 Exchange](milestones/MILESTONE_03_EXCHANGE.md) ·
  [04 Monetization](milestones/MILESTONE_04_MONETIZATION.md)
