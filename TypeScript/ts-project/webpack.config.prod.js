// bundle for production configuration
// "build" in package.json should be 'webpack --config webpack.config.prod.js to use this configuration file instead of the default

const path = require("path");
const CleanPlugin = require("clean-webpack-plugin"); // npm install --save-dev clean-webpack-plugin

module.exports = {
  mode: "production", // the mode which webpack server should run
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // passes the root dir with dist as the path to output
  },
  devServer: {
    static: [{ directory: path.join(__dirname) }],
  },
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
  plugins: [new CleanPlugin.CleanWebpackPlugin()], // clears everything in the output folder(dist) before compiling anything there
};
