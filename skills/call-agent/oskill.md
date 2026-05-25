# call-agent

## Description
Selects and calls a Ploinky agent through RoutingServer. Use this skill when the user asks to delegate a task to an available Ploinky agent, asks for an agent by capability tag, or asks for a task such as coding, research, summarization, analysis, or automation that may be better handled by a live agent advertised through capabilities.

## Instructions
1. Call get-capabilities with empty input to retrieve the current environment's available agents.
2. Read each returned agent entry and use its payload, tags, summary, when-to-use guidance, endpoint hints, and any other metadata it exposes to determine suitability.
3. If the user named a specific agent, verify that it appears in the capabilities response before calling it.
4. Select the best agent by matching the user request against capability metadata. Prefer explicit tags and usage guidance when present, but do not require fixed fields.
5. If no suitable agent is available, explain that no advertised agent matches the request.
6. Pass the selected agent and the user's request text to chat-completion using text input: first line `agent: <name>`, then the request text.
7. Never call an agent directly by host or port. All calls must go through the allowed C-Skills.

## Allowed Skills
- get-capabilities
- chat-completion

## Session Type
loop
