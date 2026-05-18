module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require use of DOMPurify when assigning to innerHTML to prevent XSS vulnerabilities",
      category: "Security",
      recommened: true,
    },
    messages: {
      requireDOMPurifyComment: "Assigning data to 'innerHTML' without sanitation.",
    },
    fixable: "code",
    schema: [],
    languages: ["js/js"],
  },
  create(context) {
    return {
      "AssignmentExpression[left.property.name='innerHTML']"(node) {
        const rightSide = context.sourceCode.getText(node.right);

        if (!rightSide.includes("DOMPurify.sanitize")) {
          context.report({
            node,
            messageId: "requireDOMPurifyComment",
            fix(fixer) {
              return fixer.replaceText(
                node.right,
                `DOMPurify.sanitize(${rightSide})`,
              );
            },
          });
        }
      },
    };
  },
};
