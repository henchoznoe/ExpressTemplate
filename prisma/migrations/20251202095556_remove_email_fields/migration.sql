/*
  Warnings:

  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_reset_expires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_reset_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verification_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_verified",
DROP COLUMN "password_reset_expires",
DROP COLUMN "password_reset_token",
DROP COLUMN "verification_token";
