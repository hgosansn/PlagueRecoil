const path = require('path');
const webpack = require('webpack');
const env = require('./environment');
// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

// Read package.json
const pjson = require('./package.json');

var today = () => {
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${ye}-${mo}-${da}`;
};

const paths = [
    {
        path: '/',
        lastmod: true,
        priority: 1,
        changefreq: 'monthly',
    },
];

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.jsx'),
    },
    resolve: {
        // configuration options
        extensions: ['', '.js', '.jsx'],
    },
    devtool: false,
    output: {
        filename: '[name].js', // Enable cache-busting
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 4200,
        hot: true,
        open: true,
        watchFiles: ['src/**/*'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: './src',
                    globOptions: {
                        ignore: [
                            '**/*.scss',
                            '**/*.sass',
                            '**/*.js',
                            '**/*.jsx',
                            '**/index.html', // Ensure index.html is not copied by CopyPlugin
                        ],
                    },
                },
            ],
            options: { concurrency: 100 },
        }),
        new WebpackManifestPlugin({
            basePath: '',
            publicPath: '/',
        }),
        new webpack.DefinePlugin({
            NAME: JSON.stringify(pjson.name),
            VERSION: JSON.stringify(pjson.version),
            BUILT: JSON.stringify(today())
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html', // Template file to use
            filename: 'index.html', // Output file
        }),
        new RobotstxtPlugin({
            policy: [
                {
                    userAgent: '*',
                    allow: '/',
                },
            ],
            sitemap: `${env.url}/sitemap.xml`,
            host: env.url,
        }),
        new SitemapPlugin({
            base: env.url,
            paths: ['/'],
            options: {
                skipgzip: true,
            },
        }),
    ].concat(
        process.env.npm_config_withReport
            ? new BundleAnalyzerPlugin({
                  analyzerMode: 'disabled',
                  generateStatsFile: true,
                  statsOptions: {
                      source: false,
                  },
              })
            : []
    ),
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    resolve: {
        alias: {
            react: 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat', // Must be below test-utils
            'react/jsx-runtime': 'preact/jsx-runtime',
        },
    },
};
