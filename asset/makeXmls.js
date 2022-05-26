const loadPost = require('../request/post_body');
const header = process.env.XML_HEADER;
const fUtil = require('../fileUtil');
const asset = require('./main');
const starter = require('../starter/main');

module.exports = (data, makeZip) => function (res) {
	var xmlString, files;
	switch (data.type) {
		case 'char': {
			const chars = asset.chars(data.themeId);
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
		const zip = nodezip.create();
		fUtil.addToZip(zip, 'desc.xml', Buffer.from(xmlString));

		switch (data.type) {
			case 'bg': {
				for (let c = 0; c < files.length; c++) {
					const file = files[c];
					fUtil.addToZip(zip, `bg/${file.id}`, asset.loadLocal(file.id));
				}
				break;
			}
		};
		return Buffer.concat([base, await zip.zip()]);
	}
	else
		return Buffer.from(xmlString);
}
