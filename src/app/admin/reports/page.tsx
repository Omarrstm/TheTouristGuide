import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAdmin } from "@/lib/dal";
import AdminActionButton from "@/components/AdminActionButton";
import {
  deleteReportedPlace,
  deleteReportedReview,
  dismissReport,
  suspendReportedUser,
  unsuspendUser,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await getAdmin();

  const [reports, suspendedUsers] = await Promise.all([
    prisma.report.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { name: true, email: true } },
        review: {
          include: {
            place: { select: { id: true, name: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        },
        reportedUser: { select: { id: true, name: true, email: true } },
        reportedPlace: { select: { id: true, name: true, city: true } },
      },
    }),
    prisma.user.findMany({
      where: { suspendedAt: { not: null } },
      select: { id: true, name: true, email: true, suspendedAt: true },
    }),
  ]);

  return (
    <main className="flex flex-col gap-8 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">Admin</p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          Reports
        </h1>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] tracking-wide text-text uppercase">
          Pending Reports
        </h2>
        {reports.length === 0 ? (
          <p className="text-[13.5px] text-muted">No pending reports.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reports.map((report) => (
              <div key={report.id} className="card-shine flex flex-col gap-2 rounded-[4px] p-4">
                <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                  {report.targetType === "REVIEW"
                    ? "Review"
                    : report.targetType === "USER"
                      ? "User"
                      : "Place"}{" "}
                  &middot; reported by {report.reporter.name ?? report.reporter.email}
                </p>
                <p className="text-[13.5px] text-text">{report.reason}</p>

                {report.targetType === "REVIEW" && report.review && (
                  <p className="text-[12.5px] text-muted">
                    Review by {report.review.user.name ?? report.review.user.email} on{" "}
                    <Link
                      href={`/places/${report.review.place.id}`}
                      className="font-semibold text-accent hover:underline"
                    >
                      {report.review.place.name}
                    </Link>
                    {report.review.comment && `: "${report.review.comment}"`}
                  </p>
                )}

                {report.targetType === "USER" && report.reportedUser && (
                  <p className="text-[12.5px] text-muted">
                    User: {report.reportedUser.name ?? "—"} ({report.reportedUser.email})
                  </p>
                )}

                {report.targetType === "PLACE" && report.reportedPlace && (
                  <p className="text-[12.5px] text-muted">
                    Place:{" "}
                    <Link
                      href={`/places/${report.reportedPlace.id}`}
                      className="font-semibold text-accent hover:underline"
                    >
                      {report.reportedPlace.name}
                    </Link>{" "}
                    ({report.reportedPlace.city})
                  </p>
                )}

                <div className="mt-1 flex items-center gap-3">
                  {report.targetType === "REVIEW" && report.reviewId && (
                    <AdminActionButton
                      label="Delete Review"
                      confirmLabel="Confirm delete?"
                      danger
                      action={async () => {
                        "use server";
                        await deleteReportedReview(report.id);
                      }}
                    />
                  )}
                  {report.targetType === "USER" && report.reportedUserId && (
                    <AdminActionButton
                      label="Suspend User"
                      confirmLabel="Confirm suspend?"
                      danger
                      action={async () => {
                        "use server";
                        await suspendReportedUser(report.id);
                      }}
                    />
                  )}
                  {report.targetType === "PLACE" && report.reportedPlaceId && (
                    <AdminActionButton
                      label="Delete Place"
                      confirmLabel="Confirm delete?"
                      danger
                      action={async () => {
                        "use server";
                        await deleteReportedPlace(report.id);
                      }}
                    />
                  )}
                  <AdminActionButton
                    label="Dismiss"
                    action={async () => {
                      "use server";
                      await dismissReport(report.id);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] tracking-wide text-text uppercase">
          Suspended Users
        </h2>
        {suspendedUsers.length === 0 ? (
          <p className="text-[13.5px] text-muted">No suspended users.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {suspendedUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 rounded-[4px] border border-border p-4"
              >
                <div>
                  <p className="text-[13.5px] font-semibold text-text">{u.name ?? "—"}</p>
                  <p className="text-[12px] text-muted">{u.email}</p>
                </div>
                <AdminActionButton
                  label="Unsuspend"
                  action={async () => {
                    "use server";
                    await unsuspendUser(u.id);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
