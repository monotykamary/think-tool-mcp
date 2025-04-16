/**
 * Think Tool MCP implementation.
 * Provides the 'think' tool as described by Anthropic.
 */

export const thinkTool = 
  {
    name: "think",
    description:
      "Use the tool to think about something. It will not obtain new information or make any changes to the repository, but just log the thought. Use it when complex reasoning or brainstorming is needed. For example, if you explore the repo and discover the source of a bug, call this tool to brainstorm several unique ways of fixing the bug, and assess which change(s) are likely to be simplest and most effective. Alternatively, if you receive some test results, call this tool to brainstorm ways to fix the failing tests.",
    inputSchema: {
      type: "object",
      properties: {
        thought: {
          type: "string",
          description: "Your thoughts.",
        },
      },
      required: ["thought"],
    },
  };

// Tool handler for 'think'
export const thinkHandler = async (
  args: Record<string, unknown>
): Promise<string> => {
  // The tool doesn't change state, just logs the thought for the LLM's internal process.
  // We return the thought itself as the result for confirmation.
  const thought = typeof args.thought === "string" ? args.thought : "";
  return thought;
};
