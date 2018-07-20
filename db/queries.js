const knex = require('./knex');

module.exports = {
	async getFullProject(id) {
		try {
			// const project = await knex('project').where('id', id).first();
			const project = await knex('project').where('id', id).first().join('grouping', 'project_id', '=', parseInt(id));
			console.log('====================================');
			console.log(project);
			console.log('====================================');

			const groupingsGetter = await knex('grouping').where('project_id', id);
			project.groupings = groupingsGetter;
			const groupingsId = await Promise.all(project.groupings.map(grouping => knex('story').where('grouping_id', grouping.id)
				.then((stories) => {
					grouping.stories = stories;
					return Promise.all(stories.map((story) => {
						const link = knex('link').where('story_id', story.id);
						const comment = knex('comment').where('story_id', story.id);
						const list = knex('list').where('story_id', story.id);
						return Promise.all([link, comment, list]).then(results => [story.links, story.comments, story.list] = results);
					}));
				}))).then(results => results);
			return project;
		} catch (error) {
			console.log(error);
		}
	},
};
