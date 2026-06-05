import { getContent } from "@/lib/content";
import { VIPPage } from "@/components/VIPPage";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function Home() {
  const content = await getContent();
  return <VIPPage content={content} />;
}
