-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_buteco_id_fkey";

-- AlterTable
ALTER TABLE "Buteco" ADD COLUMN IF NOT EXISTS "firstCheckInAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "buteco_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_buteco_id_fkey" FOREIGN KEY ("buteco_id") REFERENCES "Buteco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill
UPDATE "Buteco" b
SET "firstCheckInAt" = sub.min_created
FROM (
  SELECT "butecoId", MIN("createdAt") AS min_created
  FROM "CheckIn"
  GROUP BY "butecoId"
) AS sub
WHERE b.id = sub."butecoId"
  AND b."firstCheckInAt" IS NULL;

-- Função que atualiza 'firstCheckInAt' ao inserir um CheckIn
CREATE OR REPLACE FUNCTION public.set_first_checkin_at()
RETURNS TRIGGER AS $$
BEGIN
  -- garante que temos createdAt (se por algum motivo for null)
  IF NEW."createdAt" IS NULL THEN
    NEW."createdAt" := now();
  END IF;

  -- Atualiza a coluna somente se ainda for NULL (evita sobrescrever)
  UPDATE "Buteco"
  SET "firstCheckInAt" = NEW."createdAt"
  WHERE id = NEW."butecoId"
    AND "firstCheckInAt" IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;CREATE OR REPLACE FUNCTION public.set_first_checkin_at()
RETURNS TRIGGER AS $$
BEGIN
  -- garante que temos createdAt (se por algum motivo for null)
  IF NEW."createdAt" IS NULL THEN
    NEW."createdAt" := now();
  END IF;

  -- Atualiza a coluna somente se ainda for NULL (evita sobrescrever)
  UPDATE "Buteco"
  SET "firstCheckInAt" = NEW."createdAt"
  WHERE id = NEW."butecoId"
    AND "firstCheckInAt" IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger AFTER INSERT na tabela CheckIn
DROP TRIGGER IF EXISTS trg_set_first_checkin_at ON "CheckIn";
CREATE TRIGGER trg_set_first_checkin_at
AFTER INSERT ON "CheckIn"
FOR EACH ROW
EXECUTE FUNCTION public.set_first_checkin_at();
