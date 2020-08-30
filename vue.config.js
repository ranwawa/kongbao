const path = require("path");
module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "./node_modules/rww-sass/lib/_index.scss"),
        path.resolve(__dirname, "./src/assets/css/common.scss"),
      ],
    },
  },
};
