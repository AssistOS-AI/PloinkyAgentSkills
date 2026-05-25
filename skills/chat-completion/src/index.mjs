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

async function loadClient() {
    const agentLibDir = process.env.PLOINKY_AGENT_LIB_DIR || '/Agent';
    return await import(`${agentLibDir}/client/AgentHttpClient.mjs`);
}

export async function action(context = {}) {
    try {
        const input = parseInput(context.promptText);
        const { createAgentHttpClient } = await loadClient();
        const client = createAgentHttpClient();
        const response = await client.chatCompletions(input.agent, buildRequest(input.message));
        return JSON.stringify(response);
    } catch (error) {
        return JSON.stringify({ error: error?.message || String(error) });
    }
}
