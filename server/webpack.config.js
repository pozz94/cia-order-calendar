const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const clientPackage = require('../client/package.json')
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin')

const basePackageValues = {
	"name": "calendario-consegne-cia",
	"main": "./server.js",
	"homepage": ".",
	"engines": {
		"node": "<= 6.9.1"
	},
	"scripts": {
		"setup": "npm install && npm run install",
		"install": "node serviceScripts/install",
    	"uninstall": "node serviceScripts/uninstall"
	},
	"dependencies": {
		...clientPackage.dependencies,
		"node-windows": "^1.0.0-beta.1",
	}
}

const versionsPackageFilename = __dirname + "/package.json";

// inside your webpack configuration


module.exports = {
	entry: {
		server: './src/bin/www.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js'
	},
	mode: 'production',
	target: 'node',
	node: {
		// Need this when working with express, otherwise the build fails
		__dirname: false,   // if you don't put this is, __dirname
		__filename: false,  // and __filename return blank or /
	},
	externals: [nodeExternals()], // Need this to avoid error when working with Express
	module: {
		rules: [
			{
				// Transpiles ES6-8 into ES5
				test: /\.js$/,
				exclude: /\/node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						plugins: ["@babel/plugin-proposal-class-properties"],
						presets: [[
							"@babel/preset-env", {
								"targets": {
									"node": true
								}
							}]]
					}
				}
			}
		]
	},
	plugins: [new GeneratePackageJsonPlugin(basePackageValues, versionsPackageFilename)],
}