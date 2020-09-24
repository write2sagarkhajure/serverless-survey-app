const { getSurvey } = require("../lib/db");

module.exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  const survey = await getSurvey(event.pathParameters.id);

  return {
    statusCode: 200,
    headers:{ 'Access-Control-Allow-Origin' : '*' },
    body: JSON.stringify(survey)
  };
};
