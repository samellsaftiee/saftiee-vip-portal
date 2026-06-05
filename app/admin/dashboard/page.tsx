import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const content = await getContent();
  return <AdminDashboard initialContent={content} />;
}
