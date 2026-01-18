import type { NotificationToken } from "~/server/db/schema";

export const sendNotification = async (params: {
  id: string;
  title: string;
  body: string;
  targetUrl?: string;
  tokens: NotificationToken[];
}) => {
  const url = params.tokens[0]!.url;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: params.title,
      body: params.body,
      targetUrl: params.targetUrl || "https://immutagen.ai",
      tokens: params.tokens.map((token) => token.token),
      notificationId: params.id,
    }),
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
};

export const batchSendNotification = async (params: {
  id: string;
  title: string;
  body: string;
  targetUrl?: string;
  tokens: NotificationToken[];
  batchSize?: number;
}) => {
  console.log(`Sending Notification ${params.id}`);

  const batchSize = params.batchSize || 50;
  const batches = [];

  // Split tokens into batches
  for (let i = 0; i < params.tokens.length; i += batchSize) {
    batches.push(params.tokens.slice(i, i + batchSize));
  }

  console.log(
    `Sending ${params.tokens.length} notifications in ${batches.length} batches of ${batchSize}`,
  );

  // Send notifications in batches sequentially with delay
  const results: PromiseSettledResult<void>[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]!;

    console.log(`Sending batch ${i + 1}/${batches.length}...`);

    try {
      await sendNotification({
        id: `${params.id}-batch-${i}`,
        title: params.title,
        body: params.body,
        targetUrl: params.targetUrl,
        tokens: batch,
      });
      results.push({ status: "fulfilled", value: undefined });
    } catch (error) {
      results.push({ status: "rejected", reason: error });
    }

    // Add 1 second delay between batches (except for the last one)
    if (i < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Log results
  const successful = results.filter(
    (result) => result.status === "fulfilled",
  ).length;
  const failed = results.filter(
    (result) => result.status === "rejected",
  ).length;

  console.log(
    `Batch notification results: ${successful} successful, ${failed} failed`,
  );

  if (failed > 0) {
    console.error(
      "Failed batches:",
      results.filter((result) => result.status === "rejected"),
    );
  }

  return { successful, failed, totalBatches: batches.length };
};
