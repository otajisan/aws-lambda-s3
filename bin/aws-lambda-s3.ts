#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsLambdaS3Stack } from '../lib/aws-lambda-s3-stack';

const app = new cdk.App();
new AwsLambdaS3Stack(app, 'AwsLambdaS3Stack', {
    env: {
        //account: 'morning-code-dev',
        //account: 'mtaji',
        region: 'ap-northeast-1',
    }
});
