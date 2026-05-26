# chat-completion
Calls a Ploinky agent OpenAI-compatible chat completion endpoint through RoutingServer.

## Summary
Sends plain text to a named Ploinky agent through `AgentHttpClient` and wraps it as an OpenAI chat-completions request.

## Input Format
- Text input only.
- First line must be `agent: <name>`, where `<name>` is an agent route name from `get-capabilities`.
- The remaining text is forwarded as the user message.

Accepted form:
```text
agent: openaiAgent
prompt text goes here, which can be multiple lines and include any content the user wants to send to the agent.
```

## Output Format
- **Type**: Plain text string.
- **Success**: Assistant answer text extracted from the OpenAI-compatible chat completion response.
- **Error**: `{"error":"message"}`

## Constraints
- Always call through `AgentHttpClient`; never call an agent host port directly.
- Build the OpenAI-compatible request internally as `messages: [{ role: "user", content: text }]`.
- Do not validate the selected agent beyond requiring an `agent` name.
