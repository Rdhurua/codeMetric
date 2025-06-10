export function analyzePython(code: string) {
  try {
    const loopRegex = /(for\s.+:|while\s.+:)/g;
    const recursionRegex = /def\s+(\w+)\s*\(.*\):[\s\S]*?\1\s*\(/g;
    const arrayRegex = /(\[\s*\]|\blist\b|\bappend\b)/g;

    const loops = code.match(loopRegex) || [];
    const recursion = recursionRegex.test(code);
    const arrays = code.match(arrayRegex) || [];

    const maxDepth = code.split('\n').reduce((depth, line) => {
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

    const space = arrays.length > 0 ? "O(n)" : "O(1)";

    return {
      time,
      space,
      explanation: `Detected ${loops.length} loop(s), ${
        recursion ? "recursion present" : "no recursion"
      }, estimated nesting depth ${maxDepth}.`,
    };
  } catch (err) {
    return {
      time: "Unknown",
      space: "Unknown",
      explanation: "Error analyzing Python code.",
      err
    };
  }
}
