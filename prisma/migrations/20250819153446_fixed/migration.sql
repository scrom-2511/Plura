/*
  Warnings:

  - You are about to drop the column `mistral` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatUUID]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatUUID` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mistralChatSummary` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ChatHistory" DROP CONSTRAINT "ChatHistory_chatID_fkey";

-- DropIndex
DROP INDEX "public"."Chat_uuid_key";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "mistral",
DROP COLUMN "uuid",
ADD COLUMN     "chatUUID" TEXT NOT NULL,
ADD COLUMN     "mistralChatSummary" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatUUID_key" ON "public"."Chat"("chatUUID");

-- AddForeignKey
ALTER TABLE "public"."ChatHistory" ADD CONSTRAINT "ChatHistory_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "public"."Chat"("chatUUID") ON DELETE RESTRICT ON UPDATE CASCADE;
