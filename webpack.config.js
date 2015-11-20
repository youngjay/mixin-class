var webpackConfig = {
    output: {
        path: './dist',
        filename: 'mixin.js',
        library: 'mixin',
        libraryTarget: 'umd'
    },

    entry: './index.js'
};

module.exports = webpackConfig;