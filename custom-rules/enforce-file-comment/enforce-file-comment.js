module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Requires a file-level comment at the top of every JS file",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      missingFileComment:
        "JS files must start with an informative block or line comment containing '@file'.",
    },
    fixable: "code",
    schema: [],
    languages: ["js/js"],
  },

  create(context) {
    return {
      Program(node) {
        const sourceCode = context.sourceCode || context.getSourceCode();

        const firstToken = sourceCode.getFirstToken(node);
        const comments = sourceCode.getAllComments(node);

        const headerComments = firstToken
          ? comments.filter((c) => c.range[1] < firstToken.range[0])
          : comments;

        const hasFileComment = headerComments.some((c) =>
          c.value.includes("@file"),
        );

        if (!hasFileComment) {
          context.report({
            node,
            loc: { line: 1, column: 0 },
            messageId: "missingFileComment",
            fix(fixer) {
              const placeholderComment =
                "/**\n * @file Describe your file here.\n */\n\n";

              return fixer.insertTextBeforeRange([0, 0], placeholderComment);
            },
          });
        }
      },
    };
  },
};
