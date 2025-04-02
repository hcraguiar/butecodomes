/*
  Warnings:

  - You are about to drop the column `used` on the `Invite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "used",
ADD COLUMN     "acceptedById" TEXT;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
