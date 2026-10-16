const path = require('path');

function bundle(entry, filename) {
    return {
        entry: entry,
        output: {
            path: path.resolve(__dirname, "js"),
            filename: filename,
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
}

// Independent compilations: the main page bundle never includes (or pays for) the /card code.
module.exports = [
    bundle("./js/main.js", "dist.js"),
    bundle("./js/card/index.js", "card.js"),
];
