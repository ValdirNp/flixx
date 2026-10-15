const path = require('path');
const fs = require('fs');

const entries = {
    dist: "./js/main.js",
};

// Internal /card route: separate bundle so the main page never loads it.
if (fs.existsSync(path.resolve(__dirname, "js/card/index.js"))) {
    entries.card = "./js/card/index.js";
}

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, "js"),
        filename: "[name].js",
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
