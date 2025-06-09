export function analyzeCpp(code: string) {
  try {
    const loopRegex = /\b(for|while|do)\b\s*\(.*\)/g;
    const recursionRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(.*\)\s*{[\s\S]*?\1\s*\(/g;
    const arrayRegex = /\b(new\s+\w+|\[\]|std::vector|malloc|calloc)\b/g;

    const loops = code.match(loopRegex) || [];
    const recursion = recursionRegex.test(code);
    const arrays = code.match(arrayRegex) || [];

    // Estimate nesting via curly braces indentation
    const depthEstimate = code
      .split("\n")
      .reduce((depth, line) => {
        const open = (line.match(/{/g) || []).length;
        const close = (line.match(/}/g) || []).length;
        return Math.max(depth + open - close, 0);
      }, 0);

    let time = "O(1)";
    if (recursion) {
      time = "O(2^n)";
    } else if (loops.length === 1) {
      time = "O(n)";
    } else if (loops.length === 2 || depthEstimate >= 2) {
      time = "O(n^2)";
    } else if (loops.length >= 3 || depthEstimate >= 3) {
      time = `O(n^${depthEstimate})`;
    }

    const space = arrays.length > 0 ? "O(n)" : "O(1)";

    return {
      time,
      space,
      explanation: `Detected ${loops.length} loop(s), ${
        recursion ? "recursion present" : "no recursion"
      }, estimated nesting depth ${depthEstimate}.`,
    };
  } catch (err) {
    return {
      time: "Unknown",
      space: "Unknown",
      explanation: "Error analyzing C++ code.",
    };
  }
}
