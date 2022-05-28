/* i am afraid that people might abuse this feature. so this feature won't be added.
const starter = require('./main');

module.exports = function (url) {
	switch (url.path) {
		case '/goapi/deleteUserTemplate/': { 
			starter.delete(); 
			starter.deleteThumb();
			break; 
		}
		default: return;
	}
}
*/
console.log(`Starter Deleting Has Been Disabled Due To Fearness Of The Feature Being Abused.`);
