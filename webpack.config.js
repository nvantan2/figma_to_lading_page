const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const CopyPlugin = require("copy-webpack-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  cache: false,
  entry: {
    bundle: "./src/app.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
  devtool: isDevelopment && "source-map",
  devServer: {
    port: 3000,
    open: false,
    publicPath: "/",
    contentBase: path.join(__dirname, "./src"),
  },
  module: {
    rules: [
      { test: /\.hbs$/, loader: "handlebars-loader" },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,

          {
            loader: "css-loader",
            options: {
              sourceMap: !isDevelopment,
              minimize: !isDevelopment,
            },
          },

          {
            loader: "postcss-loader",
            options: {
              autoprefixer: {
                browsers: ["last 2 versions"],
              },
              sourceMap: isDevelopment,
              plugins: () => [autoprefixer],
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/",
              useRelativePath: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    /** Since Webpack 4 */
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {},
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name]-styles.css",
      chunkFilename: "[id].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "./src/assets"),
          to: path.join(__dirname, "./dist/assets"),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "My awesome service",
      template: "./src/index.hbs",
      minify: !isDevelopment && {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true,
        removeEmptyElements: true,
      },
    }),
  ],
};
