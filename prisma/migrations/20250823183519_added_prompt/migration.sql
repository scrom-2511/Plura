/*
  Warnings:

  - You are about to drop the column `deepseek` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `gpt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `llama` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `mistral` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `model` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ModelTypes" AS ENUM ('GPT', 'DEEPSEEK', 'MISTRAL', 'QWEN');

-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "deepseek",
DROP COLUMN "gpt",
DROP COLUMN "llama",
DROP COLUMN "mistral",
ADD COLUMN     "model" "public"."ModelTypes" NOT NULL,
ADD COLUMN     "prompt" TEXT NOT NULL;
