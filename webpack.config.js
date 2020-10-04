const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config( {
    path: path.join(__dirname, '.env')
  } );

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
    plugins: [
        new webpack.DefinePlugin( {
            'process.env': {
                API_KEY: JSON.stringify(process.env.API_KEY)
            },
        }),
    ],
};