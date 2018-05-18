#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const program = require('commander');
const sharp = require('sharp');

const cwd = process.cwd();
const sharpieSubDir = path.resolve(cwd, 'sharpened');

if (!fs.existsSync(sharpieSubDir)) fs.mkdirSync(sharpieSubDir);

const getImages = () => {
	const fileList = [];

	var files = fs.readdirSync(cwd);
	for(var i in files){
		if (!files.hasOwnProperty(i)) continue;

		var name = path.resolve(cwd, files[i]);

		if (fs.statSync(name).isDirectory()) continue;

		if (name.match(/(png|jpe?g)/)) {
			fileList.push(name);
		}

	}
	return fileList;
}

const resize = (width, height) => {
	let resizeArgs = [parseInt(width)];

	if (height) resizeArgs.push(parseInt(height));

	getImages().map(image => {
		const readStream = fs.createReadStream(image);
		const writeStream = fs.createWriteStream(
			path.resolve(sharpieSubDir + '/' + path.basename(image))
		);

		readStream.pipe(
			sharp()
				.resize(...resizeArgs)
				.on('info', (info) => {
						if (!height) console.log('new image height is: ' + info.height)
					}
				)
		).pipe(writeStream);
	});
};

program
	.command('resize <width> [height]')
	.action(resize);

program.parse(process.argv);

module.exports = resize;
