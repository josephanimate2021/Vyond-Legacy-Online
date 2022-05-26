const loadPost = require('../request/post_body');
const header = process.env.XML_HEADER;
const fUtil = require('../fileUtil');
const nodezip = require('node-zip');
const base = Buffer.alloc(1, 0);
const user = require('./main');
const fs = require('fs');
const asset = require('./main');
const starter = require('../starter/main');
const movie = require('../movie/main');

module.exports = function (req, res, url) {
	if (req.method != 'POST') return;

	var makeZip = false; switch (url.path) {
		case '/goapi/getUserAssets/': 
		case '/api_v2/assets/team':
		case '/api_v2/assets/shared': { 
			makeZip = true; 
			break; 
		}
		case '/goapi/getUserAssetsXml/': {
			break;
		}
		case '/goapi/deleteUserTemplate/': { 
			starter.delete(); 
			starter.deleteThumb(); 
			break; 
		}
		/* if i am able to make the meta for starters.
		case '/goapi/updateSysTemplateAttributes/': { 
			starter.update(); 
			break; 
		}
		*/
		default: return;
	}

	loadPost(req, res).then(async data => {
		var xmlString, files;
		switch (data.type) {
			case 'char': {
				const chars = await asset.chars(data.themeId);
				xmlString = `${header}<ugc more="0">${chars.map(v => `<char id="${v.id}" name="Untitled" cc_theme_id="${
					v.theme}" thumbnail_url="char_default.png" copyable="Y"><tags/></char>`).join('')}</ugc>`;
				break;
			}
			case 'bg': {
				xmlString = `${header}<ugc more="0"><bg id="666.jpg"></ugc>`;
				break;
			}
			case 'movie': {
				files = Promise.all(movie.listStarter().map(starter.meta)).then(a => res.end(JSON.stringify(a)));
				xmlString = `${header}<ugc more="0">${files.map(v =>`
				<movie id="${v.id}" path="/_SAVED/${v.id}" numScene="${v.sceneCount}" title="${v.name}" thumbnail_url="/starter_thumbs/${
					v.id}.png"><tags></tags></movie>`).join('')}</ugc>`;
				break;
			}
			case 'prop': {
				xmlString = `${header}<ugc more="0"><prop id="666"></ugc>`;
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
					fUtil.addToZip(zip, 'bg/666.jpg', fs.readFileSync(`./pages/img/logo.png`));
					break;
				}
				case 'prop': {
					fUtil.addToZip(zip, 'prop/666.jpg', fs.readFileSync(`./pages/img/logo.png`));
					break;
				}
			};
			res.setHeader('Content-Type', 'application/zip');
			res.end(Buffer.concat([base, await zip.zip()]));
		}
		else {
			res.setHeader('Content-Type', 'text/xml');
			res.end(xmlString);
		}
	});
	return true;
}
