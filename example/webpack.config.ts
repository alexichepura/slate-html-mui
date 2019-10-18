require("dotenv").config()
import { join } from "path"
import { Configuration as WebpackConfiguration } from "webpack"
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server"
import { template } from "./template"

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const { WDS_PORT } = process.env
const ROOT_DIR = join(__dirname, "..")
const EXAMPLE_DIR = join(ROOT_DIR, "example")
const EXAMPLE_DIST_DIR = join(EXAMPLE_DIR, "dist")
// const SRC_DIR = join(ROOT_DIR, "src")
const PUBLIC_OUTPUT_PATH = WDS_PORT ? `http://localhost:${WDS_PORT}/dist/` : "/dist/"

const config: Configuration = {
  entry: {
    app: EXAMPLE_DIR + "/app.tsx",
  },
  devServer: {
    contentBase: false,
    disableHostCheck: true,
    publicPath: PUBLIC_OUTPUT_PATH,
    compress: false,
    port: Number(WDS_PORT),
    after: function(app, _server) {
      app.get("/", function(_req, res) {
        res.end(template())
      })
    },
  },
  devtool: "cheap-module-eval-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  output: {
    filename: `[name].js`,
    chunkFilename: `[name].js`,
    path: EXAMPLE_DIST_DIR,
    publicPath: PUBLIC_OUTPUT_PATH,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    symlinks: false,
  },
}

export default config
