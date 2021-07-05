import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  console.log('------');
  console.log(event.requestContext.identity);
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  const params = {
    TableName: process.env.tableName,
    Item: {
      // The attributes of the item to be created
      userid: event.requestContext.identity.cognitoIdentityId, // The id of the author
      notesid: uuid.v1(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
