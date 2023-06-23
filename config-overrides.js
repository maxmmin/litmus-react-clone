const {addBabelPlugin, override} = require("customize-cra");

module.exports = override(
    addBabelPlugin(['@babel/plugin-proposal-decorators', {  version: "2018-09", "decoratorsBeforeExport": false }])
);