const enforceFileCommentRule = require("./enforce-file-comment")
const plugin = { rules: { "enforce-file-comment": enforceFileCommentRule } };
module.exports = plugin;
