import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const projectPath = 'd:\\HOTELPMS';
const mcpConfig = JSON.parse(readFileSync('C:\\Users\\Dell\\.cursor\\mcp.json', 'utf8'));
const apiKey = mcpConfig.mcpServers?.TestSprite?.env?.API_KEY;

if (!apiKey) {
  console.error('TestSprite API_KEY not found in Cursor MCP config');
  process.exit(1);
}

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@testsprite/testsprite-mcp@latest'],
  env: { ...process.env, API_KEY: apiKey },
});

const client = new Client({ name: 'hotelpms-runner', version: '1.0.0' }, { capabilities: {} });

async function callTool(name, args) {
  console.log(`\n>>> Calling ${name}...`);
  const result = await client.callTool({ name, arguments: args });
  const text = result.content?.map((c) => c.text).filter(Boolean).join('\n') ?? JSON.stringify(result, null, 2);
  console.log(text.slice(0, 4000));
  return result;
}

try {
  await client.connect(transport);

  await callTool('testsprite_check_account_info', {});

  await callTool('testsprite_generate_standardized_prd', { projectPath });

  await callTool('testsprite_generate_frontend_test_plan', {
    projectPath,
    needLogin: true,
  });

  const exec = await callTool('testsprite_generate_code_and_execute', {
    projectName: 'HOTELPMS',
    projectPath,
    testIds: [],
    additionalInstruction: 'Test the complete Hotel PMS application including public website, admin panel, front office, and housekeeping flows. Use admin@hotelpms.com / admin123 for staff login at /admin/login.',
    serverMode: 'development',
  });

  const next = exec.content?.[0]?.text;
  if (next) {
    const parsed = JSON.parse(next);
    const terminalCmd = parsed?.next_action?.find((a) => a.tool === 'Run in Terminal')?.input?.command;
    if (terminalCmd) {
      console.log('\n>>> Execution command prepared. Run separately:', terminalCmd);
    }
  }
} finally {
  await client.close();
}
