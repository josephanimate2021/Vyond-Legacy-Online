const movie = require('../movie/main');
const starter = require('./main');
module.exports = function (req, res, url) {
	if (req.method != 'GET' || url.path != '/starterList') return;
	Promise.all(movie.listStarter().map(starter.meta)).then(a => res.end(JSON.stringify(a)));
	return true;
}
