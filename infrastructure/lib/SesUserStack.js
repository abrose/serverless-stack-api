import * as cdk from "@aws-cdk/core";
import * as sst from "@serverless-stack/resources";
import * as iam from "@aws-cdk/aws-iam";
import { Effect } from "@aws-cdk/aws-iam";

export default class SesUserStack extends sst.Stack {


  constructor(scope, id, props) {
    super(scope, id, props);

    const app = this.node.root;

    const userName = app.logicalPrefixedName('test-ses-user');

    // Create user managed policy which allows the created user to read the list 
    // of supressed destinations
    const allowListSuppressedDestinationsStmt = new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        "ses:ListSuppressedDestinations"
      ],
      effect: Effect.ALLOW
    });

    const allowListSuppressedDestinationsPolicy = new iam.Policy(this, 'SesListSuppressed', {
      policyName: "test-SesListSuppressed",
      statements: [
        allowListSuppressedDestinationsStmt
      ],
    });

    // Create new user for SES access
    const user = new iam.User(this, 'test-ses-user', {
      userName: userName
    });

    // Attach the SES policy
    user.attachInlinePolicy(allowListSuppressedDestinationsPolicy);

    const accessKey = new iam.CfnAccessKey(this, 'testSesUserKey', {
      userName: user.userName,
    });

    new cdk.CfnOutput(this, 'accessKeyId', { value: accessKey.ref });
    new cdk.CfnOutput(this, 'secretAccessKey', { value: accessKey.attrSecretAccessKey });
  }
}
