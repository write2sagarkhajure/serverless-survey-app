const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { Model } = require("dynamodb-toolbox");
const { v4: uuidv4 } = require("uuid");

const User = new Model("User", {
  table: "users",

  // Define partition and sort keys
  partitionKey: "pk",
  sortKey: "sk",

  // Define schema
  schema: {
    pk: { type: "string", alias: "email" },
    sk: { type: "string", hidden: true, alias: "type" },
    id: { type: "string" },
    passwordHash: { type: "string" },
    createdAt: { type: "string" }
  }
});

// Init AWS
AWS.config.update({
  region: "us-east-1"
});

const documentClient = new AWS.DynamoDB.DocumentClient();

const createDbUser = async props => {
  const passwordHash = await bcrypt.hash(props.password, 8);
  delete props.password;

  const params = User.put({
    ...props,
    id: uuidv4(),
    type: "User",
    passwordHash
  });

  console.log("create user with params", params);
  const response = await documentClient.put(params).promise();

  return User.parse(response);
};

const getUserByEmail = async email => {
  try {
    const params = User.get({ email, sk: "User" });
    const response = await documentClient.get(params).promise();
    const parsedResponse = User.parse(response);
    console.log(parsedResponse);
    return parsedResponse;
  } catch (err) {
    console.error(err);

    return {};
  }  
};

const getSurvey = async surveyId => {
  const params = {
    TableName: "surveys",
    Key:{
        id: surveyId
    }
  };

  const response = await documentClient.get(params).promise();
  console.log(JSON.stringify(response));
  return response;
}

const createSurvey = async props => {
  const params = {
    TableName: "surveys",
    Item: {
      id: uuidv4(),
      surveyActive: props.surveyActive,
      surveyName: props.surveyName,
      surveyUrl: props.surveyUrl,
      surveyFrom: props.surveyFrom,
      surveyExpiry: props.surveyExpiry,
      surveyAccessibility: props.surveyAccessibility,
      surveyTrigger: props.surveyTrigger
    }
  }

  console.log("create survey with params", params);
  const response = await documentClient.put(params).promise();
  
  return JSON.stringify(response);
}

module.exports = {
  createDbUser,
  getUserByEmail,
  createSurvey,
  getSurvey
};
