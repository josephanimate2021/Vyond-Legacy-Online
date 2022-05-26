const chars = require('../character/main');
const caché = require('../data/caché');
const fUtil = require('../fileUtil');
const info = require('./info');
const fs = require('fs');
const movie = require('../movie/main');
const starter = require('../starter/main');
const header = process.env.XML_HEADER;
const nodezip = require('node-zip');
const base = Buffer.alloc(1, 0);



function getFilter(prefix, idPrefix, types) {
	const typeSet = {}, files = [], ret = [];
	types.forEach(v => {
		const names = fUtil.getValidFileNames(prefix, `.${v}`);
		typeSet[v] = true, files.concat(names);
	});
	for (let c = 0; c < files.length; c++) {
		const path = files[c];
		const dot = path.lastIndexOf('.');
		const dash = path.lastIndexOf('-');
		const num = Number.parseInt(path.substr(dash + 1, dot));
		const ext = path.substr(dot + 1), id = `${idPrefix}-${num}.${ext}`;
		ret.push({ id: id, path: path, ext: ext, });
	}
	return ret;
}

module.exports = {
	loadGlobal(aId) {
		const dot = aId.indexOf('.');
		const dash = aId.indexOf('-');
		const prefix = aId.substr(0, dash);
		const num = aId.substr(dash + 1, dot);
		const suffix = aId.substr(dot);
		const path = fUtil.getFileIndex(prefix, suffix, num);
		return fs.readFileSync(path);
	},
	loadLocal(mId, aId) { return caché.load(mId, aId); },
	saveLocal(buffer, mId, suff) { return caché.saveNew(buffer, mId, suff); },
	getBackgrounds() { return getFilter('bg-', 'b', info.bg.filetypes); },
	getProps() { return getFilter('prop-', 'p', info.prop.filetypes); },
	getSounds() { return getFilter('sound-', 's', info.sound.filetypes); },
	async cc(theme) {
		switch (theme) {
			case 'custom':
				theme = 'family';
				break;
			case 'action':
			case 'animal':
			case 'space':
			case 'vietnam':
				theme = 'cc2';
				break;
		}

		const table = [];
		const ids = fUtil.getValidFileIndicies('char-', '.xml');
		for (let c = 0; c < ids.length; c++) {
			const v = ids[c];
			const id = `c-${v}`;
			if (theme == await chars.getTheme(id))
				table.unshift({ theme: theme, id: id, });
		}
		return table;
	},
	async listAssets(data, makeZip) {
		return new Promise((res, rej, url) => {
			var xmlString, files;
			switch (data.type) {
				case 'char': {
					const chars = await this.cc(data.themeId);
					xmlString = `${header}<ugc more="0">${chars.map(v => `<char id="${v.id}" name="Untitled" cc_theme_id="${
								v.theme}" thumbnail_url="char_default.png" copyable="Y"><tags/></char>`).join('')}</ugc>`;
					break;
				}
				case 'movie': {
					files = Promise.all(movie.listStarter().map(starter.meta)).then(a => res.end(JSON.stringify(a)));
					xmlString = `${header}<ugc more="0">${files.map(v =>`
					<movie id="${v.id}" path="/_SAVED/${
								v.id}" numScene="${v.sceneCount}" title="${v.name}" thumbnail_url="/starter_thumbs/${
										v.id}.png"><tags></tags></movie>`).join('')}</ugc>`;
					break;
				}
				default: { // No File Type? Send in a blank response.
					xmlString = `${header}<ugc more="0"></ugc>`;
					break;
				}
			};

			if (makeZip) {
				fUtil.addToZip(nodezip.create(), 'desc.xml', Buffer.from(xmlString));

				switch (data.type) {
					case 'bg': {
						for (let c = 0; c < files.length; c++) {
							const file = files[c];
							fUtil.addToZip(nodezip.create(), `bg/${file.id}`, this.loadLocal(file.id));
						}
						break;
					}
				};
				return Buffer.from(xmlString);
			}
		});
	},
};
