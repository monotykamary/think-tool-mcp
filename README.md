# Think Tool MCP Server

A Model Context Protocol (MCP) server for logging, reviewing, and managing thoughts. This server exposes a single tool suite for structured reasoning, step-by-step analysis, and thought management—ideal for AI agents needing to log and review their internal reasoning.

## Overview

This MCP server provides tools to log thoughts, review the thinking process, clear the log, and get statistics about the session's thoughts. It is designed for use with Claude Desktop or any MCP-compatible client.

## Available Tools

The server provides the following tools:

1. **think**: Log a thought (with timestamp) to the session.
   - Parameters:
     - `thought` (required): The thought to log. Should include structured reasoning, step-by-step analysis, or any mental process. Strictly record the source URL after each piece of evidence for citation.

2. **get_thoughts**: Retrieve all recorded thoughts in the session.
   - Parameters: None

3. **clear_thoughts**: Clear the session's thought log.
   - Parameters: None

4. **get_thought_stats**: Get statistics about the thoughts recorded in the session.
   - Parameters: None

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

## Usage Examples

### Example 1: Logging a Thought

```
mcp_think(thought="I should check the latest research on MCP servers. https://example.com/mcp-paper")
```

### Example 2: Retrieving All Thoughts

```
mcp_get_thoughts()
```

### Example 3: Clearing the Thought Log

```
mcp_clear_thoughts()
```

### Example 4: Getting Thought Statistics

```
mcp_get_thought_stats()
```

## Troubleshooting

- **No Thoughts Recorded**: If you retrieve thoughts before logging any, you'll get a message indicating no thoughts have been recorded.
- **Session State**: The thought log is stored in memory and will reset if the server restarts.

## License

MIT
