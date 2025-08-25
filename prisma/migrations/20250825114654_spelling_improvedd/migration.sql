/*
  Warnings:

  - You are about to drop the column `prisma` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "prisma",
ADD COLUMN     "premium" BOOLEAN NOT NULL DEFAULT false;
