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
    const s3UploadArn = 'arn:aws:s3:::' + bucket.bucketName
    lambdaFn.addToRolePolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        // TODO: なぜかresourcesを*にしないとLambda -> S3にアクセスできない
        resources: [
            bucket.bucketArn,
            bucket.bucketArn + '/*',
            s3UploadArn,
        ],
        //resources: ['*'],
        actions: [
            's3:PutObject',
            's3:PutObjectAcl',
        ]
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
