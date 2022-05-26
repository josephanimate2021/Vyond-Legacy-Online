const loadPost = require('../request/post_body');
const header = process.env.XML_HEADER;
const fUtil = require('../fileUtil');
const asset = require('./main');
const starter = require('../starter/main');
const nodezip = require('node-zip');

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
		case 'bg': {
			xmlString = `${header} <ugc more="0"><bg id="666.jpg"></ugc>`;
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
				fUtil.addToZip(zip, 'bg/666.jpg', fs.readFileSync(`/pages/img/logo.png`));
				break;
			}
		};
		res.setHeader('Content-Type', 'application/zip');
		res.end(Buffer.concat([base, await zip.zip()]));
	} else {
		res.setHeader('Content-Type', 'text/xml');
		res.end(xmlString);
	}
}
