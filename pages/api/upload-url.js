import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.PULP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.PULP_AWS_SECRET_KEY,
    region: process.env.PULP_AWS_REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  const post = await s3.createPresignedPost({
    Bucket: process.env.PULP_AWS_BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
      
    ],
  });
  console.log('POST', post)
  return res.status(200).json(post);
}
