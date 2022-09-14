exports.handler = async function (event, context) {
  try {
    // const method = event.httpMethod;
    const ENV_OPTION = process.env.ENV_OPTION;

    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify({ name: "Cesar Workshop", option: ENV_OPTION }),
    };
  } catch (error) {
    const body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(body),
    };
  }
};
