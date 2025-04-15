/**
 * Think Tool MCP implementation.
 * Provides: think, get_thoughts, clear_thoughts, get_thought_stats.
 */

type ThoughtEntry = {
  timestamp: string;
  thought: string;
};

class ThinkToolSession {
  private thoughtsLog: ThoughtEntry[] = [];

  think(thought: string = ""): string {
    const timestamp = new Date().toISOString();
    this.thoughtsLog.push({ timestamp, thought });
    return thought;
  }

  get_thoughts(): string {
    if (this.thoughtsLog.length === 0) {
      return "No thoughts have been recorded yet.";
    }
    return this.thoughtsLog
      .map(
        (entry, i) =>
          `Thought #${i + 1} (${entry.timestamp}):\n${entry.thought}\n`
      )
      .join("\n");
  }

  clear_thoughts(): string {
    const count = this.thoughtsLog.length;
    this.thoughtsLog = [];
    return `Cleared ${count} recorded thoughts.`;
  }

  get_thought_stats(): string {
    if (this.thoughtsLog.length === 0) {
      return "No thoughts have been recorded yet.";
    }
    const total = this.thoughtsLog.length;
    const avgLength =
      this.thoughtsLog.reduce((sum, e) => sum + e.thought.length, 0) / total;
    let longest = { length: 0, index: -1 };
    this.thoughtsLog.forEach((e, i) => {
      if (e.thought.length > longest.length) {
        longest = { length: e.thought.length, index: i };
      }
    });
    return JSON.stringify(
      {
        total_thoughts: total,
        average_length: Math.round(avgLength * 100) / 100,
        longest_thought_index:
          longest.index >= 0 ? longest.index + 1 : undefined,
        longest_thought_length: longest.length > 0 ? longest.length : undefined,
      },
      null,
      2
    );
  }
}

// Singleton session for now (can be extended for per-user/session state)
const session = new ThinkToolSession();

export const thinkTool = {
  name: "think-tool",
  tools: [
    {
      name: "think",
      description:
        "Use this tool to think about something. It will not obtain new information or change anything, but just append the thought to the log. Use it when complex reasoning or cache memory is needed.\n\nArgs:\n    thought: A thought to think about. This can be structured reasoning, step-by-step analysis, policy verification, or any other mental process that helps with problem-solving, with a strict requirement to record the source URL immediately after each piece of evidence that could be used as a reference citation for the final action.",
      parameters: {
        type: "object",
        properties: {
          thought: {
            type: "string",
            description:
              "A thought to think about. This can be structured reasoning, step-by-step analysis, policy verification, or any other mental process that helps with problem-solving, with a strict requirement to record the source URL immediately after each piece of evidence that could be used as a reference citation for the final action.",
          },
        },
        required: ["thought"],
      },
      handler: async (args: Record<string, unknown>) => {
        const thought = typeof args.thought === "string" ? args.thought : "";
        return session.think(thought);
      },
    },
    {
      name: "get_thoughts",
      description:
        "Retrieve all thoughts recorded in the current session.\n\nThis tool helps review the thinking process that has occurred so far.",
      parameters: { type: "object", properties: {}, required: [] },
      handler: async (_args: Record<string, unknown>) => {
        return session.get_thoughts();
      },
    },
    {
      name: "clear_thoughts",
      description:
        "Clear all recorded thoughts from the current session.\n\nUse this to start fresh if the thinking process needs to be reset.",
      parameters: { type: "object", properties: {}, required: [] },
      handler: async (_args: Record<string, unknown>) => {
        return session.clear_thoughts();
      },
    },
    {
      name: "get_thought_stats",
      description:
        "Get statistics about the thoughts recorded in the current session.",
      parameters: { type: "object", properties: {}, required: [] },
      handler: async (_args: Record<string, unknown>) => {
        return session.get_thought_stats();
      },
    },
  ],
};
