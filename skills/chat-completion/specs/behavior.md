# chat-completion Behavior

## Core Content

The skill parses plain text input. The first line must declare the selected route as `agent: <name>`. The remaining text is the user message to forward.

The skill builds the OpenAI-compatible request internally as `messages: [{ role: "user", content: text }]`. This guarantees the orchestrating LLM only selects an agent and passes task text, while transport formatting stays inside the deterministic C-Skill.

The skill returns only the assistant answer text from the chat completion response, normally `choices[0].message.content`. It must not return the full OpenAI response object to the orchestrating LLM.

## Decisions & Questions

### Question #1: Why does this skill require an explicit agent line?

Response:
Agent selection requires interpreting task intent against live capability metadata. That belongs to the `call-agent` orchestration skill, while this C-Skill remains a deterministic transport primitive. The input remains text-only so callers do not need to construct OpenAI request JSON.
