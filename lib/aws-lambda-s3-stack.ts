import * as cdk from '@aws-cdk/core';
import {Bucket} from '@aws-cdk/aws-s3';
import {Effect, PolicyStatement} from '@aws-cdk/aws-iam';
import {Code, Function, Runtime} from '@aws-cdk/aws-lambda';

export class AwsLambdaS3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Athenaへの入力データ保存用バケット
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

    // MEMO: 意味ないっぽい
    /*
    const athenaPolicy = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:GetBucketLocation',
                's3:GetObject',
                's3:ListBucket',
                's3:ListBucketMultipartUploads',
                's3:ListMultipartUploadParts',
                's3:AbortMultipartUpload',
                's3:CreateBucket',
                's3:PutObject'
            ],
            resources: [
                'arn:aws:s3:::aws-athena-query-results-*',
                'arn:aws:s3:::query-results-custom-bucket',
                'arn:aws:s3:::query-results-custom-bucket/*'
            ],
    });
    */
  }
}
