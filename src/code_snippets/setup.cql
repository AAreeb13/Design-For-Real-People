// ---------------------------------------------  MATHEMATICS THEME  --------------------------------------------- //


// ------------------  Calculus here   ------------------ //
CREATE (n:Subject{
	name:'calculus',
	type: 'subject',
	theme: 'mathematics'
});


CREATE (n:Subject{
	name: 'basic arithmetic',
	subject: 'calculus',
	type: 'topic',
	description: 'The study of arithmetic',
	requires: ['calculus'],
	links: 'www.example.com',
	approvals: 200,
	rejections: 30,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'proofs',
	subject: 'calculus',
	type: 'topic',
	description: 'The art of verifying mathematical statements ',
	requires: ['basic arithmetic'],
	links: 'www.example.com',
	approvals: 102,
	rejections: 23,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'differentiation',
	subject: 'calculus',
	type: 'topic',
	description: 'The gradient of things',
	requires: ['basic arithmetic'],
	links: 'www.example.com',
	approvals: 102,
	rejections: 50,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'integration',
	subject: 'calculus',
	type: 'topic',
	description: 'The study of infinite sums',
	requires: ['basic arithmetic'],
	links: 'www.example.com',
	approvals: 100,
	rejections: 50,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'limits',
	subject: 'calculus',
	type: 'topic',
	description: 'The study of infinity and zero',
	requires: ['basic arithmetic'],
	links: 'www.examples.com',
	approvals: 89,
	rejections: 14,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'limit ratio test',
	subject: 'calculus',
	type: 'topic',
	description:'The study of limit testing with ratios',
	requires: ['proofs', 'limits'],
	links: 'www.example.com',
	approvals: 23,
	rejections: 30,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'lhopitals rule',
	subject: 'calculus',
	type: 'topic',
	description:'The study of limit testing with ratios',
	requires: ['proofs', 'limits', 'differentiation'],
	links: 'www.example.com',
	approvals: 23,
	rejections: 30,
	comments: [],
	suggestions: [] ,
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'chain rule',
	subject: 'calculus',
	type: 'topic',
	description:'Technique for differentiation' ,
	requires: ['differentiation'],
	links: 'www.example.com',
	approvals: 97,
	rejections: 23,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'product rule',
	subject: 'calculus',
	type: 'topic',
	description:'Technique for differentiation' ,
	requires: ['differentiation'],
	links: 'www.example.com',
	approvals: 80,
	rejections: 40,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'Integration by Parts',
	subject: 'calculus',
	type: 'topic',
	description: 'Technique for integration',
	requires: ['integration'],
	links: 'www.example.com',
	approvals: 74,
	rejections: 23,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'Integration by Substitution',
	subject: 'calculus',
	type: 'topic',
	description: 'Technique for integration',
	requires: ['integration'],
	links: 'www.example.com',
	approvals: 5,
	rejections: 2,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
	});



MATCH (title:Subject{name: 'calculus'}), (subject:Subject{name:'basic arithmetic'})
CREATE (title) - [:IS_USED_IN] -> (subject);

MATCH (title:Subject{name: 'limits'}), (subject:Subject{name:'LHospitals rule'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'limits'}), (subject:Subject{name:'limit ratio test'})
CREATE (title) - [:IS_USED_IN] -> (subject);

MATCH (title:Subject{name: 'proofs'}), (subject:Subject{name:'LHospitals rule'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'proofs'}), (subject:Subject{name:'limit ratio test'})
CREATE (title) - [:IS_USED_IN] -> (subject);

MATCH (title:Subject{name: 'basic arithmetic'}), (subject:Subject{name:'proofs'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'basic arithmetic'}), (subject:Subject{name:'limits'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'basic arithmetic'}), (subject:Subject{name:'differentiation'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'basic arithmetic'}), (subject:Subject{name:'integration'})
CREATE (title) - [:IS_USED_IN] -> (subject);

MATCH (title:Subject{name: 'integration'}), (subject:Subject{name:'integration by substitution'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'integration'}), (subject:Subject{name:'integration by parts'})
CREATE (title) - [:IS_USED_IN] -> (subject);

MATCH (title:Subject{name: 'differentiation'}), (subject:Subject{name:'product rule'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'differentiation'}), (subject:Subject{name:'chain rule'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'differentiation'}), (subject:Subject{name:'LHospitals rule'})
CREATE (title) - [:IS_USED_IN] -> (subject);





// ------------------   Probability here   ------------------ //

CREATE (n:Subject{
	name:'probability and statistics',
	type: 'subject',
	theme: 'mathematics'
});


CREATE (n:Subject{
	name: 'mean',
	subject: 'probability and statistics',
	type: 'topic',
	description: 'The study of averages',
	requires: ['probability and statistics'],
	links: 'www.example.com',
	approvals: 200,
	rejections: 30,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'variance',
	subject: 'probability and statistics',
	type: 'topic',
	description: 'The study of skewness',
	requires: ['probability and statistics'],
	links: 'www.example.com',
	approvals: 200,
	rejections: 30,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'standard deviation',
	subject: 'probability and statistics',
	type: 'topic',
	description: 'The study of averages',
	requires: ['variance'],
	links: 'www.example.com',
	approvals: 200,
	rejections: 30,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'skewness',
	subject: 'probability and statistics',
	type: 'topic',
	description: 'The study of skew',
	requires: ['probability and statistics'],
	links: 'www.example.com',
	approvals: 200,
	rejections: 30,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

CREATE (n:Subject{
	name: 'moment generating function',
	subject: 'probability and statistics',
	type: 'topic',
	description: 'The study of generating mean, variance, standard deviation and skewness',
	requires: ['probability and statistics', 'mean', 'standard deviation', 'skewness'],
	links: 'www.example.com',
	approvals: 200,
	rejections: 30,
	comments: [],
	suggestions: [],
	resources: [],
	learning_objectives: []
});

MATCH (title:Subject{name: 'probability and statistics'}), (subject:Subject{name:'mean'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'probability and statistics'}), (subject:Subject{name:'variance'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'probability and statistics'}), (subject:Subject{name:'skewness'})
CREATE (title) - [:IS_USED_IN] -> (subject);

MATCH (title:Subject{name: 'variance'}), (subject:Subject{name:'standard deviation'})
CREATE (title) - [:IS_USED_IN] -> (subject);

MATCH (title:Subject{name: 'mean'}), (subject:Subject{name:'moment generating function'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'standard deviation'}), (subject:Subject{name:'moment generating function'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'skewness'}), (subject:Subject{name:'moment generating function'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'differentiation'}), (subject:Subject{name:'moment generating function'})
CREATE (title) - [:IS_USED_IN] -> (subject);
MATCH (title:Subject{name: 'integration'}), (subject:Subject{name:'moment generating function'})
CREATE (title) - [:IS_USED_IN] -> (subject);




// ---------------------------------------------  PROGRAMMING THEME  --------------------------------------------- //
















