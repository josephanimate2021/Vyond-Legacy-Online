const starter = require('./main');
module.exports = function (req, res, url) {
	if (req.method != 'GET' || !url.path.startsWith('/starters/meta')) return;
	starter.meta(url.path.substr(url.path.lastIndexOf('/') + 1))
		.then(v => res.end(JSON.stringify(v)))
		.catch(() => { res.statusCode = 404; res.end() });
	return true;
}