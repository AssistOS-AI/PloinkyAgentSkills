function parseInput(promptText) {
    const raw = String(promptText || '').trim();
    if (!raw) return {};
    if (raw.startsWith('{')) {
        return JSON.parse(raw);
    }
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*?)\s*$/);
        if (match) out[match[1]] = match[2];
    }
    return out;
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
        const agent = typeof input.agent === 'string' && input.agent.trim() ? input.agent.trim() : undefined;
        const { createAgentHttpClient } = await loadClient();
        const client = createAgentHttpClient({
            invocationToken: extractInvocationToken(context)
        });
        const response = await client.capabilities(agent);
        return JSON.stringify(response);
    } catch (error) {
        return JSON.stringify({ error: error?.message || String(error) });
    }
}
