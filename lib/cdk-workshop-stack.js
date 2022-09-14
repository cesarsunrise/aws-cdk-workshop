const { Stack, Duration } = require("aws-cdk-lib");
const Lambda = require("aws-cdk-lib/aws-lambda");
const ApiGateway = require("aws-cdk-lib/aws-apigateway");
// const sqs = require('aws-cdk-lib/aws-sqs');

class CdkWorkshopStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // Lambda
    const handler = new Lambda.Function(this, "CdkWorkshopTestLambda", {
      functionName: `lambda-${id}`,
      runtime: Lambda.Runtime.NODEJS_16_X,
      code: Lambda.Code.fromAsset("resources"),
      handler: "lambda.handler",
      timeout: Duration.seconds(5),
      environment: {
        ENV_OPTION: "This is my env value",
        ENV_DEPLOY: process.env.ENV_DEPLOY,
      },
    });

    // API Gateway
    const apiGateway = new ApiGateway.RestApi(this, `Api-${id}`, {
      restApiName: `Api-${id}`,
      description: "This service serves lambdas",
      deployOptions: {
        stageName: process.env.ENV_NAME || "dev",
      },
    });

    // Create API KEY
    const apiKeyName = `ApKey-${id}`;
    const apiKey = new ApiGateway.ApiKey(this, "APIKey-CDK-Workshop", {
      apiKeyName,
      description: "APIKey used by my cdk api",
      enabled: true,
    });

    // Create Usage Plan
    const usagePlanProps = {
      name: `UsagePlan-${id}`,
      apiKey,
      apiStages: [{ apiGateway, stage: apiGateway.deploymentStage }],
      throttle: { burstLimit: 500, rateLimit: 1000, quota: { limit: 1000000 } },
    };

    apiGateway.addUsagePlan(`UsagePlan-${id}`, usagePlanProps);

    const getLambdaIntegraton = new ApiGateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    apiGateway.root.addMethod("GET", getLambdaIntegraton, {
      apiKeyRequired: true,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { CdkWorkshopStack };
