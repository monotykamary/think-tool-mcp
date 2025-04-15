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

export const thinkTools = [
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
  },
  {
    name: "get_thoughts",
    description:
      "Retrieve all thoughts recorded in the current session.\n\nThis tool helps review the thinking process that has occurred so far.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "clear_thoughts",
    description:
      "Clear all recorded thoughts from the current session.\n\nUse this to start fresh if the thinking process needs to be reset.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_thought_stats",
    description:
      "Get statistics about the thoughts recorded in the current session.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
];

// Tool handler mapping
export const thinkToolHandlers: Record<
  string,
  (args: Record<string, unknown>) => Promise<string>
> = {
  think: async (args) => {
    const thought = typeof args.thought === "string" ? args.thought : "";
    return session.think(thought);
  },
  get_thoughts: async () => session.get_thoughts(),
  clear_thoughts: async () => session.clear_thoughts(),
  get_thought_stats: async () => session.get_thought_stats(),
};
