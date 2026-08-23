"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { deleteSession } from "@/lib/session";

export async function updateAccountProfile(input: { name: string; homeCountry: string }) {
  const { userId } = await verifySession();

  const name = input.name.trim();
  const homeCountry = input.homeCountry.trim();

  if (name.length < 2) throw new Error("Enter your name.");

  await prisma.user.update({
    where: { id: userId },
    data: { name, homeCountry: homeCountry || null },
  });

  revalidatePath("/account");
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  const { userId } = await verifySession();

  if (input.newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { password: true },
  });

  const valid = await bcrypt.compare(input.currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect.");

  const hashedPassword = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
}

export async function deleteAccount() {
  const { userId } = await verifySession();

  await prisma.user.delete({ where: { id: userId } });
  await deleteSession();
  redirect("/");
}
