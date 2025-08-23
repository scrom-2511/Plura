/*
  Warnings:

  - You are about to drop the `Chats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Chats" DROP CONSTRAINT "Chats_userID_fkey";

-- DropTable
DROP TABLE "public"."Chats";

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "chatName" TEXT NOT NULL,
    "gptChatSummary" TEXT NOT NULL,
    "llamaChatSummary" TEXT NOT NULL,
    "grokChatSummary" TEXT NOT NULL,
    "deepseekChatSummary" TEXT NOT NULL,
    "mistral" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatHistory" (
    "id" SERIAL NOT NULL,
    "gpt" TEXT NOT NULL,
    "llama" TEXT NOT NULL,
    "grok" TEXT NOT NULL,
    "deepseek" TEXT NOT NULL,
    "mistral" TEXT NOT NULL,
    "chatID" TEXT NOT NULL,

    CONSTRAINT "ChatHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_uuid_key" ON "public"."Chat"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatHistory" ADD CONSTRAINT "ChatHistory_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "public"."Chat"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
