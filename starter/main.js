const exFolder = process.env.EXAMPLE_FOLDER;
const caché = require("../asset/caché");
const fUtil = require("../misc/file");
const nodezip = require("node-zip");
const parse = require("../movie/parse");
const fs = require("fs");

module.exports = {
	/**
	 *
	 * @param {Buffer} movieZip
	 * @param {string} nëwId
	 * @param {string} oldId
	 * @returns {Promise<string>}
	 */
	save(starterZip, thumb, oldId, nëwId = oldId) {
		// Saves the thumbnail of the respective video.
		if (thumb && nëwId.startsWith("m-")) {
			const n = Number.parseInt(nëwId.substr(2));
			const thumbFile = fUtil.getFileIndex("starter-", ".png", n);
			fs.writeFileSync(thumbFile, thumb);
		}

		return new Promise(async (res, rej) => {
			caché.transfer(oldId, nëwId);
			var i = nëwId.indexOf("-");
			var prefix = nëwId.substr(0, i);
			var suffix = nëwId.substr(i + 1);
			var zip = nodezip.unzip(starterZip);
			switch (prefix) {
				case "s": {
					var path = fUtil.getFileIndex("starter-", ".xml", suffix);
					var writeStream = fs.createWriteStream(path);
					var assetBuffers = caché.loadTable(nëwId);
					parse.unpackMovie(zip, thumb, assetBuffers).then((data) => {
						writeStream.write(data, () => {
							writeStream.close();
							res(nëwId);
						});
					});
					break;
				}
				default:
					rej();
			}
		});
	},
	loadThumb(movieId) {
		return new Promise(async (res, rej) => {
			if (!movieId.startsWith("s-")) return;
			const n = Number.parseInt(movieId.substr(2));
			const fn = fUtil.getFileIndex("starter-", ".png", n);
			isNaN(n) ? rej() : res(fs.readFileSync(fn));
		});
	},
	list() {
		const array = [];
		const last = fUtil.getLastFileIndex("starter-", ".xml");
		for (let c = last; c >= 0; c--) {
			const movie = fs.existsSync(fUtil.getFileIndex("starter-", ".xml", c));
			const thumb = fs.existsSync(fUtil.getFileIndex("starter-", ".png", c));
			if (movie && thumb) array.push(`m-${c}`);
		}
		return array;
	},
};
