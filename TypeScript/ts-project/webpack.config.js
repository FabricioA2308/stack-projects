// first should run npm install --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader
// then add "build" and tweak "start" in package.json

const path = require("path");

module.exports = {
  mode: "development", // the mode which webpack server should run
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // passes the root dir with dist as the path to output
    publicPath: "/dist/", // the path where it should look for the filename variable
  },
  devServer: {
    static: [{ directory: path.join(__dirname) }],
  },
  devtool: "inline-source-map", // tells webpack that there will be source maps and those should adjust to the bundle created by webpack
  module: {
    rules: [
      // what webpack should search for
      {
        test: /\.ts$/, // looks for every file that ends with .ts
        use: "ts-loader", // sets the handler for the .ts files
        exclude: /node_modules/, // ignore all node modules
      },
    ],
  },
  resolve: {
    // what extension should webpack add to the imports it finds in the files
    extensions: [".ts", ".js"], // webpack attempts to bundle this files in order
  },
};
