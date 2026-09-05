import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

function absoluteUrl(href: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://the-tourist-guide.vercel.app";
  return `${base}${href}`;
}

export async function notifyUser(input: {
  userId: string;
  type: "NEW_MESSAGE" | "NEW_REVIEW" | "NEW_GUIDE_RATING" | "FOLLOWED_USER_REVIEW";
  title: string;
  body?: string;
  href: string;
}) {
  await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { email: true },
  });
  if (!user) return;

  await sendEmail({
    to: user.email,
    subject: input.title,
    html: `<p>${input.body ?? input.title}</p><p><a href="${absoluteUrl(input.href)}">View on TheTouristGuide</a></p>`,
  });
}
