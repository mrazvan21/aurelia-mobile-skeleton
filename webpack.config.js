const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const { optimize: { CommonsChunkPlugin }, ProvidePlugin } = require('webpack');

// config helpers:
const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || []
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig)

// primary config:
const title = 'aurelia-mobile-skeleton';
const outDir = path.resolve(__dirname, 'www');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const cssRules = [
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: { plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })]}
  },
  { loader: 'sass-loader' },
]

module.exports = ({production, server, extractCss, coverage} = {}) => ({
  resolve: {
    extensions: ['.js'],
    modules: [srcDir, 'node_modules', path.join(__dirname, "node_modules")],
  },
  entry: {
    app: ['aurelia-bootstrapper'],
    vendor: ['bluebird', 'jquery', 'bootstrap'],
  },
  output: {
    path: outDir,
    filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
    sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
    chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js',
  },
  devServer: {
    contentBase: outDir,
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true,
  },
  module: {
    rules: [
      // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
      // only when the issuer is a .js/.ts file, so the loaders are not applied inside html templates
      {
        test: /\.(css|scss)$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssRules,
        }) : ['style-loader', ...cssRules],
        exclude: /aurelia-ux/
      },
      {
        test: /\.(css|scss)$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: cssRules,
        exclude: /aurelia-ux/
      },
      {
        test: /\.css$/i,
        loader: 'raw-loader',
        include: /aurelia-ux/,
      },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.js$/i, loader: 'babel-loader', exclude: nodeModulesDir,
        options: coverage ? { sourceMap: 'inline', plugins: [ 'istanbul' ] } : {},
      },
      { test: /\.json$/i, loader: 'json-loader' },
      // use Bluebird as the global Promise implementation:
      { test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/, loader: 'expose-loader?Promise' },
      // exposes jQuery globally as $ and as jQuery:
      { test: require.resolve('jquery'), loader: 'expose-loader?$!expose-loader?jQuery' },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
    ]
  },
  plugins: [
    new AureliaPlugin(),
    new ModuleDependenciesPlugin({
      'aurelia-ux': [
        'aurelia-ux/button/ux-button-theme.css',
        'aurelia-ux/input/ux-input-theme.css',
        'aurelia-ux/form/ux-form-theme.css',
        'aurelia-ux/form/ux-field-theme.css',
        'aurelia-ux/button/ux-button-theme.css',
        'aurelia-ux/checkbox/ux-checkbox-theme.css',
        'aurelia-ux/chip-input/ux-chip-theme.css',
        'aurelia-ux/chip-input/ux-chip-input-theme.css',
        'aurelia-ux/chip-input/ux-tag-theme.css',
        'aurelia-ux/icons/ux-icon-theme.css',
        'aurelia-ux/input-info/ux-input-info-theme.css',
        'aurelia-ux/textarea/ux-textarea-theme.css'
      ]
    }),
    new ProvidePlugin({
      'Promise': 'bluebird',
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      minify: production ? {
        removeComments: true,
        collapseWhitespace: true
      } : undefined,
      metadata: {
        // available in index.ejs //
        title, server, baseUrl
      },
    }),
    new CopyWebpackPlugin([
      { from: 'resources/favicon.ico', to: 'favicon.ico' }
    ]),
    ...when(extractCss, new ExtractTextPlugin({
      filename: production ? '[contenthash].css' : '[id].css',
      allChunks: true,
    })),
    ...when(production, new CommonsChunkPlugin({
      name: 'common'
    }))
  ],
  devServer: {
    host: "0.0.0.0",
    port: 3000
  }
})
