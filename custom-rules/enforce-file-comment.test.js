const { RuleTester } = require("eslint");
const enforceFileCommentRule = require("./enforce-file-comment");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run("enforce-file-comment", enforceFileCommentRule, {
  // checks
  // 'valid' checks cases that should pass
  valid: [
    {
      code: `
/**
 * @file This is the main entry point.
 */
const x = 1;
      `.trim(),
    },
  ],

  // 'invalid' checks cases that should not pass
  invalid: [
    {
      code: "const x = 1;",
      output: "/**\n * @file Describe your file here.\n */\n\nconst x = 1;",
      errors: [{ messageId: "missingFileComment" }],
    },
    {
      code: `
// A regular line comment
const x = 1;
	  `.trim(),
	  output: "/**\n * @file Describe your file here.\n */\n\n// A regular line comment\nconst x = 1;",
      errors: [{ messageId: "missingFileComment" }],
    },
  ],
});

console.log("All tests passed!");
