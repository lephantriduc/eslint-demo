const enforceFileCommentRule = require("./enforce-file-comment/enforce-file-comment");
const requireDompurify = require("./require-dompurify/require-dompurify");

const plugin = {
  rules: {
    "enforce-file-comment": enforceFileCommentRule,
    "require-dompurify": requireDompurify,
  },
};
module.exports = plugin;
