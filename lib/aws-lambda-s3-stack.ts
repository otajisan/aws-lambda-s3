import * as cdk from '@aws-cdk/core';
import iam = require('@aws-cdk/aws-iam');
import {Bucket} from '@aws-cdk/aws-s3';
import {PolicyStatement} from '@aws-cdk/aws-iam';
import {Code, Function, Runtime} from '@aws-cdk/aws-lambda';

export class AwsLambdaS3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'mySampleBucket', {
        //bucketName: 'my-sample-bucket',
        publicReadAccess: false,
    });

    const lambdaFn = new Function(this, 'LambdaS3UploaderSample', {
        functionName: 'lambda-s3-uploader-sample',
        runtime: Runtime.PYTHON_3_8,
        code: Code.asset('lambda'),
        handler: 'uploader.handler',
    });

    //const s3UploadArn = 'arn:aws:s3:' + this.region + ':' + this.account + ''
    lambdaFn.addToRolePolicy(new PolicyStatement({
        //resources: [bucket.bucketArn],
        resources: ['*'],
        actions: ['s3:PutObject']
    }));
  }
}
