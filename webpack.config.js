const path = require('path');

module.exports = {
    entry: "./js/main.js",
    output: {
        path: path.resolve(__dirname, "js"),
        filename: "dist.js",
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                include: path.resolve(__dirname, "js"),
                use: {
                    loader: "babel-loader"
                }
            },
        ]
    },
};
