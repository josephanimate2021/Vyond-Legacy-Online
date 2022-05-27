module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var attrs, params, server, ut, redirectUrl;
	switch (url.pathname) {
		case '/videomaker/full/': {     
			params = {
				flashvars: {
					'tray': '',
				},
			};
			break;
                }
		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`<html>
	<head>
		<script>
			function genorateId() { 
				window.location = '/studio?tray=${params.flashvars.tray}'; 
			}
		</script>
	</head>
	<body onload="genorateId()"></body>
</html>`);
	return true;
}
