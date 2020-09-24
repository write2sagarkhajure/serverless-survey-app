const { createSurvey } = require("../lib/db");

module.exports.handler = async (event) => {
  console.log(event.body);
  const body = JSON.parse(event.body);
  const survey = await createSurvey(body);

  return {
    statusCode: 200,
    headers:{ 'Access-Control-Allow-Origin' : '*' },
    body: JSON.stringify(survey)
  };
};
