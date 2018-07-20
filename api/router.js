const express = require('express');
const queries = require('../db/queries');

const router = express.Router();

router.get('/project/:id', (req, res) => {
	queries.getFullProject(req.params.id).then(users => res.json(users));
});
module.exports = router;
