#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { thinkTool } from "./tools/thinkTool";

// Register all tools
const allTools = thinkTool.tools;

async function main() {
  console.error("Starting Think Tool MCP Server...");
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
        const tool = allTools.find((t) => t.name === request.params.name);
        if (!tool) {
          throw new Error(`Tool not found: ${request.params.name}`);
        }
        // Ensure required arguments for "think"
        let args = request.params.arguments || {};
        if (tool.name === "think") {
          if (typeof args.thought !== "string") {
            throw new Error('Missing required argument: "thought"');
          }
          args = { thought: args.thought };
        }
        const result = await tool.handler(args);
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

  // Register tool listing handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools,
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Think Tool MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
