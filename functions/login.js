const { login } = require("../lib/utils");

module.exports.handler = async function signInUser(event) {
  const body = JSON.parse(event.body);

  return login(body)
    .then(res => {
      console.log(res);

      if (res.statusCode == 401) {
        return {
          statusCode: 401,
          headers:{ 'Access-Control-Allow-Origin' : '*' },
        };
      } else {
        return {
          statusCode: 200,
          headers:{ 'Access-Control-Allow-Origin' : '*' },
          body: JSON.stringify(res)
        };
      }
    }).catch(err => {
      console.log(err);

      return {
        statusCode: err.statusCode || 500,
        headers: { "Content-Type": "text/plain"},
        body: { stack: err.stack, message: err.message }
      };
    });
};
