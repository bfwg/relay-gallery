const fs = require('fs');
const path = require('path');
const schema = require('../schema/schema').schema;
const graphql = require('graphql').graphql;
const graphqlUtilities = require('graphql/utilities');
const introspectionQuery = graphqlUtilities.introspectionQuery;
const printSchema = graphqlUtilities.printSchema;

// Save JSON of full schema introspection for Babel Relay Plugin to use
graphql(schema, introspectionQuery).then(result => {
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../frontend/schema/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
});

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, '../frontend/schema/schema.graphql'),
  printSchema(schema)
);


