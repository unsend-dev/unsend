import {
  SNSClient,
  CreateTopicCommand,
  SubscribeCommand,
} from "@aws-sdk/client-sns";
import { env } from "~/env";

function getSnsClient(region: string) {
  return new SNSClient({
    region: region,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    },
  });
}

export async function createTopic(topic: string, region: string) {
  const client = getSnsClient(region);
  const command = new CreateTopicCommand({
    Name: topic,
  });

  const data = await client.send(command);
  return data.TopicArn;
}

export async function subscribeEndpoint(
  topicArn: string,
  endpointUrl: string,
  region: string
) {
  const subscribeCommand = new SubscribeCommand({
    Protocol: "https",
    TopicArn: topicArn,
    Endpoint: endpointUrl,
  });
  const client = getSnsClient(region);

  const data = await client.send(subscribeCommand);
  console.log(data.SubscriptionArn);
  return data.SubscriptionArn;
}
