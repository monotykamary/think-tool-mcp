#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { thinkTool, thinkHandler } from "./tools/thinkTool"; // Updated import

async function main() {
  console.error("Starting Simplified Think Tool MCP Server..."); // Updated name
  const server = new Server(
    {
      name: "Think Tool MCP Server",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Register tool call handler
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      try {
        // Only handle the 'think' tool
        if (request.params.name !== thinkTool.name) {
          throw new Error(`Unsupported tool: ${request.params.name}. Only '${thinkTool.name}' is available.`);
        }
        
        const args = request.params.arguments || {};
        const result = await thinkHandler(args); // Directly call the handler
        return {
          content: [{ type: "text", text: JSON.stringify(result) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    },
  );

  // Register tool listing handler - only list the 'think' tool
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [thinkTool], // Return only the single tool definition
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Simplified Think Tool MCP Server running on stdio"); // Updated name
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
