var express = require("express")
	,router = express.Router();

require('./schemas');
router.use(require("./usuariosRouter.js"));
router.use(require('./planesRouter.js'));
router.use(require('./clientesRouter.js'));
module.exports = router;