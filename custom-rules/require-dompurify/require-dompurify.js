module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Require use of DOMPurify when assigning to innerHTML to prevent XSS vulnerabilities",
    },
  },
  create(context) {
    return {
      "AssignmentExpression[left.property.name='innerHTML']"(node) {
        
        const rightSide = context.sourceCode.getText(node.right);
        
        if (!rightSide.includes("DOMPurify.sanitize")) {
          context.report({
            node,
            message: "SECURITY WARNING: Assigning data to innerHTML without sanitization! Wrap the right-hand side with DOMPurify.sanitize().",
          });
        }
      }
    };
  }
};