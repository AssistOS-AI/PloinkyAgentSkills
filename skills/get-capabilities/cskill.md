# get-capabilities
Reads Ploinky agent capability metadata through RoutingServer.

## Summary
Retrieves capability metadata for all routable Ploinky agents or for one named agent. This skill is the discovery primitive for deciding which Ploinky agent should handle a task.

## Input Format
- **agent** (string, optional): Agent route name. When omitted, the skill requests aggregate capabilities for every routable agent.

Accepted forms:
- JSON object: `{"agent":"openaiAgent"}`
- Key-value text: `agent: openaiAgent`
- Empty input: list all capabilities.

## Output Format
- **Type**: JSON string.
- **Aggregate success**: `{"agents":[{"name":"agentName","payload":{...}}],"errors":[]}`
- **Single-agent success**: The JSON payload returned by the router for that agent.
- **Error**: `{"error":"message"}`

## Constraints
- Always call agents through `AgentHttpClient`; never call an agent host port directly.
- Do not validate or narrow capability payload fields. The router and agents may return arbitrary JSON metadata.
- Use `PLOINKY_ROUTER_URL` or the router environment variables resolved by `AgentHttpClient`.
