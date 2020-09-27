const path = require("path");
const { npm_lifecycle_event, VUE_APP_PLATFORM } = process.env;
const [env, platform] = npm_lifecycle_event.split(":");
module.exports = {
  chainWebpack: (config) => {
    // 增加环境变量信息
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0]["process.env"], {
        customEnv: `"${env}"`,
        customPlatform: `"${platform}"`,
        npm_lifecycle_event: `"${npm_lifecycle_event}"`,
        VUE_APP_PLATFORM: `"${VUE_APP_PLATFORM}"`,
      });
      return definitions;
    });
  },
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
