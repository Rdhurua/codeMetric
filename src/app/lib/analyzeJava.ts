export function analyzeJava(code: string) {
  try {
    const loopRegex = /\b(for|while|do)\b\s*\(.*\)/g;
    const recursionRegex = /(?:public|private|protected)?\s+\w+\s+(\w+)\s*\(.*\)\s*{[^}]*\1\s*\(.*\)/gs;
    const memoryRegex = /\bnew\b\s+\w+|\bArrayList\b|\badd\b/g;

    const loops = code.match(loopRegex) || [];
    const recursion = recursionRegex.test(code);
    const dynamicMemory = code.match(memoryRegex) || [];

    let maxDepth = code
      .split("\n")
      .reduce((depth, line) => {
        const indent = line.match(/^\s+/);
        return Math.max(depth, indent ? indent[0].length / 4 : 0);
      }, 0);

    let time = "O(1)";
    if (recursion) {
      time = "O(2^n)";
    } else if (loops.length === 1) {
      time = "O(n)";
    } else if (loops.length === 2 || maxDepth >= 2) {
      time = "O(n^2)";
    } else if (loops.length >= 3 || maxDepth >= 3) {
      time = `O(n^${maxDepth})`;
    }

    const space = dynamicMemory.length > 0 ? "O(n)" : "O(1)";

    return {
      time,
      space,
      explanation: `Detected ${loops.length} loop(s), ${
        recursion ? "recursion present" : "no recursion"
      }, nesting depth ~${maxDepth}, dynamic memory usage: ${dynamicMemory.length > 0}`,
    };
  } catch (err) {
    return {
      time: "Unknown",
      space: "Unknown",
      explanation: "Error analyzing Java code.",
    };
  }
}
