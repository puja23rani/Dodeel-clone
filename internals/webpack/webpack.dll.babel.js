/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const { join } = require("path");
const defaults = require("lodash/defaultsDeep");
const webpack = require("webpack");
const pkg = require(join(process.cwd(), "package.json")); // eslint-disable-line
const { dllPlugin } = require("../config");

const dotenv = require("dotenv");
dotenv.config();

if (!pkg.dllPlugin) {
  process.exit(0);
}

const dllConfig = defaults(pkg.dllPlugin, dllPlugin.defaults);
const outputPath = join(process.cwd(), dllConfig.path);

module.exports = require("./webpack.base.babel")({
  mode: "development",
  context: process.cwd(),
  entry: dllConfig.dlls ? dllConfig.dlls : dllPlugin.entry(pkg),
  optimization: {
    minimize: false,
  },
  devtool: "eval",
  output: {
    uniqueName: "[name]",
    filename: "[name].dll.js",
    path: outputPath,
    library: "[name]",
  },
  legacyNodePolyfills: false,
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: join(outputPath, "[name].json"),
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_BASE_URL": JSON.stringify(
        process.env.REACT_APP_BASE_URL
      ),
    }),
  ],
  performance: {
    hints: false,
  },
});
