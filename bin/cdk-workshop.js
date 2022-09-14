#!/usr/bin/env node
require("dotenv").config();
const cdk = require("aws-cdk-lib");
const { CdkWorkshopStack } = require("../lib/cdk-workshop-stack");

const app = new cdk.App();
const env = process.env.ENV_NAME || "dev";

const stackName = "WorkshopCDK-" + env;
const workshopCDKStack = new CdkWorkshopStack(app, stackName, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

cdk.Tags.of(workshopCDKStack).add("workshop-cdk", stackName);
