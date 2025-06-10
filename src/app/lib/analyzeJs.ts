import *as esprima from 'esprima';

export  function analyzeJavascript(code:string){
     try {
    const ast = esprima.parseScript(code, { loc: true });

    let loopCount = 0;
    let maxLoopDepth = 0;
    let recursionDetected = false;

    const loopTypes = ["ForStatement", "WhileStatement", "DoWhileStatement"];

    const traverse = (node, depth = 0, currentFuncName = "") => {
      if (!node) return;

      // Count loops and track nesting
      if (loopTypes.includes(node.type)) {
        loopCount++;
        maxLoopDepth = Math.max(maxLoopDepth, depth + 1);
      }

      // Detect recursion
      if (node.type === "FunctionDeclaration") {
        const funcName = node.id?.name || "";
        const body = node.body?.body || [];

        for (const stmt of body) {
          if (
            stmt.type === "ExpressionStatement" &&
            stmt.expression.type === "CallExpression" &&
            stmt.expression.callee.name === funcName
          ) {
            recursionDetected = true;
          }
        }

        currentFuncName = funcName;
      }

      for (const key in node) {
        const child = node[key];
        if (typeof child === "object" && child !== null) {
          if (Array.isArray(child)) {
            for (const c of child) traverse(c, loopTypes.includes(node.type) ? depth + 1 : depth, currentFuncName);
          } else {
            traverse(child, loopTypes.includes(node.type) ? depth + 1 : depth, currentFuncName);
          }
        }
      }
    };

    traverse(ast);

    // Improved Time Complexity Estimation
    let time = "O(1)";
    if (recursionDetected) {
      time = "O(2^n)";
    } else if (maxLoopDepth === 1) {
      time = "O(n)";
    } else if (maxLoopDepth === 2) {
      time = "O(n^2)";
    } else if (maxLoopDepth >= 3) {
      time = `O(n^${maxLoopDepth})`;
    }

    // Improved Space Complexity
    // Just using variable declarations or loops doesn’t imply O(n) space
    let space = "O(1)";
    if (code.includes("new Array") || code.includes("push(")) {
      space = "O(n)";
    }

    return {
      time,
      space,
      explanation: `Detected ${loopCount} loop(s), ${
        recursionDetected ? "recursion present" : "no recursion"
      }, max loop nesting depth ${maxLoopDepth}.`,
    };
  } catch (err) {
    return {
      time: "Unknown",
      space: "Unknown",
      explanation: "Error parsing JS code.",
      err
    };
  }
}
