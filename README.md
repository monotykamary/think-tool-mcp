# Think Tool MCP Server (Simplified)

A Model Context Protocol (MCP) server implementing the `think` tool as described by [Anthropic](https://www.anthropic.com/engineering/claude-think-tool). This server provides a dedicated space for an AI agent to perform structured thinking during complex tasks, improving reasoning and decision-making.

## Overview

This simplified MCP server provides only the `think` tool. It allows an AI agent to log its reasoning process without affecting external state or retrieving new information. This implementation is based on the concept outlined in Anthropic's engineering blog post on enhancing agentic tool use. This specific think tool uses the adapted SWE-Bench version.

It is designed for use with Claude Desktop or any MCP-compatible client.

## Available Tool

The server provides the following tool:

1. **think**: Use the tool to think about something. It will not obtain new information or make any changes to the repository, but just log the thought. Use it when complex reasoning or brainstorming is needed.
   - Parameters:
     - `thought` (required, string): A thought to think about.
   - Input Schema:
     ```json
     {
       "type": "object",
       "properties": {
         "thought": {
           "type": "string",
           "description": "Your thoughts."
         }
       },
       "required": ["thought"]
     }
     ```

## Setup

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/monotykamary/think-tool-mcp.git
   cd think-tool-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run the server:
   ```bash
   node dist/index.js
   ```

### Environment Variables

No environment variables are required for the Think Tool MCP server.

### Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t think-tool-mcp .
   ```

2. Run the container:
   ```bash
   docker run -i --rm think-tool-mcp
   ```

## Usage with Claude Desktop

To use this MCP server with Claude Desktop, add the following configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "think-tool": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "ghcr.io/monotykamary/think-tool-mcp"
      ]
    }
  }
}
```

With this configuration:
1. Claude will automatically start the Docker container when needed.
2. The MCP server will be available for logging and reviewing thoughts.
3. The container will be removed when Claude Desktop is closed.

## Usage Example

### Logging a Thought

```json
// Example MCP Tool Call
{
  "tool_name": "think",
  "arguments": {
    "thought": "Okay, the user wants to refactor the database schema. First, I need to analyze the current schema (using get_schema tool), then identify potential improvements like normalization or indexing. After that, I'll propose a new schema and ask for confirmation before generating the migration script."
  }
}
```

## Troubleshooting

- **Server Connection**: Ensure the server is running (locally or via Docker) and configured correctly in your MCP client (e.g., Claude Desktop settings).
- **Tool Name**: Verify you are calling the tool named `think`.

## License

MIT
