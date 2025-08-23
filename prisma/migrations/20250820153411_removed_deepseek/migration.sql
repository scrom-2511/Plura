/*
  Warnings:

  - You are about to drop the column `deepseekChatSummary` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `deepseek` on the `ChatHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "deepseekChatSummary";

-- AlterTable
ALTER TABLE "public"."ChatHistory" DROP COLUMN "deepseek";
