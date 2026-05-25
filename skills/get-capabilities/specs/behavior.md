# get-capabilities Behavior

## Core Content

The skill imports `AgentHttpClient` from `process.env.PLOINKY_AGENT_LIB_DIR || '/Agent'` and calls `client.capabilities(agent?)`.

When `agent` is absent, the skill calls the aggregate router endpoint and returns the full response unchanged as a JSON string. When `agent` is present, it calls the single-agent capabilities endpoint and returns that response unchanged.

The skill must not inspect required fields such as `tags`, `summary`, or `schema`. Capability metadata is an open-ended JSON contract owned by each agent.

## Decisions & Questions

### Question #1: Why is the aggregate response not normalized?

Response:
Ploinky capabilities are discovery metadata, not a fixed schema. Normalizing in this skill would prevent agents from publishing domain-specific hints and would make the client responsible for policy that belongs to the caller.
