# ADR-006: AGPL-3.0 License

## Status: Accepted

## Context
The platform is open source and backed by Edge AI Foundation. Need a license that protects against proprietary forks while encouraging community contribution.

## Decision
Use AGPL-3.0-only.

## Rationale
- Strong copyleft ensures modifications remain open source
- SaaS protection — anyone hosting the platform must share their changes
- Aligned with Edge AI Foundation's open source mission
- Compatible with most open source dependencies

## Consequences
- All contributions must be AGPL-3.0 compatible
- Third-party integrations via the public API are not affected (API usage is not "linking")
- Contributors must accept AGPL terms
