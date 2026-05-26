function parseInput(promptText) {
    const raw = String(promptText || '').trim();
    if (!raw) throw new Error('Input text is required.');
    const lines = raw.split(/\r?\n/);
    const agentMatch = lines[0].match(/^agent\s*:\s*(.+)$/i);
    if (!agentMatch) throw new Error('First line must be `agent: <name>`.');
    const agent = agentMatch[1].trim();
    if (!agent) throw new Error('agent is required.');
    const message = lines.slice(1).join('\n').trim();
    if (!message) throw new Error('message text is required.');
    return { agent, message };
}

function buildRequest(message) {
    return {
        messages: [{ role: 'user', content: message }],
        stream: false
    };
}

function extractAnswerText(response) {
    const choice = Array.isArray(response?.choices) ? response.choices[0] : null;
    const content = choice?.message?.content ?? choice?.text ?? response?.message?.content ?? response?.content;
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === 'string') return part;
                if (part && typeof part === 'object' && typeof part.text === 'string') return part.text;
                return '';
            })
            .filter(Boolean)
            .join('\n');
    }
    return typeof response === 'string' ? response : JSON.stringify(response);
}

async function loadClient() {
    const agentLibDir = process.env.PLOINKY_AGENT_LIB_DIR || '/Agent';
    return await import(`${agentLibDir}/client/AgentHttpClient.mjs`);
}

function extractInvocationToken(context = {}) {
    const candidates = [
        context.invocationToken,
        context.context?.invocationToken
    ];
    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim()) {
            return candidate.trim();
        }
    }
    return '';
}

export async function action(context = {}) {
    try {
        const input = parseInput(context.promptText);
        const { createAgentHttpClient } = await loadClient();
        const client = createAgentHttpClient({
            invocationToken: extractInvocationToken(context)
        });
        const response = await client.chatCompletions(input.agent, buildRequest(input.message));
        return extractAnswerText(response);
    } catch (error) {
        return JSON.stringify({ error: error?.message || String(error) });
    }
}
