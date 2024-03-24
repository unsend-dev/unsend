import {
  SNSClient,
  CreateTopicCommand,
  SubscribeCommand,
} from "@aws-sdk/client-sns";
import { env } from "~/env";

function getSnsClient(region = "us-east-1") {
  return new SNSClient({
    region: region,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    },
  });
}

export async function createTopic(topic: string) {
  const client = getSnsClient();
  const command = new CreateTopicCommand({
    Name: topic,
  });

  const data = await client.send(command);
  return data.TopicArn;
}

export async function subscribeEndpoint(topicArn: string, endpointUrl: string) {
  const subscribeCommand = new SubscribeCommand({
    Protocol: "https",
    TopicArn: topicArn,
    Endpoint: endpointUrl,
  });
  const client = getSnsClient();

  const data = await client.send(subscribeCommand);
  console.log(data.SubscriptionArn);
  return data.SubscriptionArn;
}
