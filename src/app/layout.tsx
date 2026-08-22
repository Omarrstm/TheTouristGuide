import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import { getOptionalUser } from "@/lib/dal";
import prisma from "@/lib/prisma";
import AppHeader from "@/components/AppHeader";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheTouristGuide",
  description:
    "Find touristic places rated by travelers, and hidden gems suggested by locals — for when you don't know where to go.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getOptionalUser();
  const hasUnreadMessages = user
    ? (await prisma.message.findFirst({
        where: {
          readAt: null,
          senderId: { not: user.id },
          conversation: { OR: [{ travelerId: user.id }, { guideId: user.id }] },
        },
        select: { id: true },
      })) !== null
    : false;

  return (
    <html
      lang="en"
      className={`${anton.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:px-10">
          <AppHeader user={user ? { name: user.name } : null} hasUnreadMessages={hasUnreadMessages} />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
