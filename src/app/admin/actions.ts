"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

async function requireAdmin() {
  const { userId } = await verifySession();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  if (!user?.isAdmin) throw new Error("Not authorized.");
  return userId;
}

export async function deleteReportedReview(reportId: string) {
  await requireAdmin();

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report?.reviewId) throw new Error("Report not found.");

  await prisma.review.delete({ where: { id: report.reviewId } });

  revalidatePath("/admin/reports");
}

export async function deleteReportedPlace(reportId: string) {
  await requireAdmin();

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report?.reportedPlaceId) throw new Error("Report not found.");

  await prisma.place.delete({ where: { id: report.reportedPlaceId } });

  revalidatePath("/admin/reports");
}

export async function dismissReport(reportId: string) {
  await requireAdmin();

  await prisma.report.update({
    where: { id: reportId },
    data: { status: "DISMISSED" },
  });

  revalidatePath("/admin/reports");
}

export async function suspendReportedUser(reportId: string) {
  await requireAdmin();

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report?.reportedUserId) throw new Error("Report not found.");

  await prisma.user.update({
    where: { id: report.reportedUserId },
    data: { suspendedAt: new Date() },
  });
  await prisma.session.deleteMany({ where: { userId: report.reportedUserId } });
  await prisma.report.update({
    where: { id: reportId },
    data: { status: "RESOLVED" },
  });

  revalidatePath("/admin/reports");
}

export async function unsuspendUser(userId: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { suspendedAt: null },
  });

  revalidatePath("/admin/reports");
}
