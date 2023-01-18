const path = require("path");

module.exports = {
  entry: "./app.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test : /\.js/,
        use: "file-loader"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  mode: "development",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist")
  }
};