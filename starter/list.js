const starter = require('./main');
module.exports = function (req, res, url) {
	if (req.method != 'GET' || url.path != '/starterList') return;
	Promise.all(starter.listAsMovie().map(starter.meta)).then(a => res.end(JSON.stringify(a)));
	return true;
}
