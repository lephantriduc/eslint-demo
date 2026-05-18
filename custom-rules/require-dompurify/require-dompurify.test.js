const { RuleTester } = require("eslint");
const requireDompurifyRule = require("./require-dompurify");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run("require-dompurify", requireDompurifyRule, {
  // checks
  // 'valid' checks cases that should pass
  valid: [
    {
      code: "element.innerHTML = DOMPurify.sanitize(dirtyHtml);",
    },
    {
      code: "element.innerHTML = DOMPurify.sanitize('<h1>Hello</h1>');",
    },
  ],

  // 'invalid' checks cases that should not pass
  invalid: [
    {
      code: "element.innerHTML = dirtyHtml;",
      output: "element.innerHTML = DOMPurify.sanitize(dirtyHtml);",
      errors: [
        { message: "Assigning data to 'innerHTML' without sanitation." },
      ],
    },
    {
      code: "element.innerHTML = '<h1>' + title + '</h1>';",
      output:
        "element.innerHTML = DOMPurify.sanitize('<h1>' + title + '</h1>');",
      errors: [
        { message: "Assigning data to 'innerHTML' without sanitation." },
      ],
    },
  ],
});

console.log("All tests passed!");
