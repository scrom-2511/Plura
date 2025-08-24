/*
  Warnings:

  - You are about to drop the column `model` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `deepseek` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpt` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mistral` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qwen` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "model",
ADD COLUMN     "deepseek" TEXT NOT NULL,
ADD COLUMN     "gpt" TEXT NOT NULL,
ADD COLUMN     "mistral" TEXT NOT NULL,
ADD COLUMN     "qwen" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."ModelTypes";
