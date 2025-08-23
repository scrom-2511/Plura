/*
  Warnings:

  - You are about to drop the column `chatUUID` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `chatID` on the `ChatHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatUUIDUnique]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatUUIDUnique` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatUUID` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `ChatHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ChatHistory" DROP CONSTRAINT "ChatHistory_chatID_fkey";

-- DropIndex
DROP INDEX "public"."Chat_chatUUID_key";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "chatUUID",
ADD COLUMN     "chatUUIDUnique" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ChatHistory" DROP COLUMN "chatID",
ADD COLUMN     "chatUUID" TEXT NOT NULL,
ADD COLUMN     "prompt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatUUIDUnique_key" ON "public"."Chat"("chatUUIDUnique");

-- AddForeignKey
ALTER TABLE "public"."ChatHistory" ADD CONSTRAINT "ChatHistory_chatUUID_fkey" FOREIGN KEY ("chatUUID") REFERENCES "public"."Chat"("chatUUIDUnique") ON DELETE RESTRICT ON UPDATE CASCADE;
