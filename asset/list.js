const loadPost = require('../request/post_body');
const header = process.env.XML_HEADER;
const fUtil = require('../fileUtil');
const nodezip = require('node-zip');
const base = Buffer.alloc(1, 0);
const asset = require('./main');
const listAssets = require('./makeXmls');
const starter = require('../starter/main');
const movie = require('../movie/main');

module.exports = function (req, res, url) {
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

	switch (req.method) {
		case 'GET': {
			listAssets(url.query, makeZip).then(buff => {
				const type = makeZip ? 'application/zip' : 'text/xml';
				res.setHeader('Content-Type', type), res.end(buff);
			});
			return true;
		}
		case 'POST': {
			loadPost(req, res).then(data => listAssets(data, makeZip)).then(buff => {
				const type = makeZip ? 'application/zip' : 'text/xml';
				res.setHeader('Content-Type', type), res.end(buff);
			});
			return true;
		}
		default: return;
	}
}
