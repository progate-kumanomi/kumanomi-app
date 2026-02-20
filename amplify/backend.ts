import { defineBackend } from '@aws-amplify/backend';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

const s3Bucket = backend.storage.resources.bucket;
const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;

// CORS ルールを設定（既存のルールを上書き）
cfnBucket.corsConfiguration = {
  corsRules: [
    {
      allowedHeaders: ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
      allowedOrigins: ['*'], // 本番環境では自身のドメイン（例: 'https://example.com'）に絞ることを推奨します
      exposedHeaders: ['ETag'],
      maxAge: 3000,
    },
  ],
};
