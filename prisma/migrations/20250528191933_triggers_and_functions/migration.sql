-- Função: atualizar_rating_buteco
CREATE OR REPLACE FUNCTION update_rating_buteco()
RETURNS TRIGGER AS $$
DECLARE
  v_buteco_id TEXT;
  v_avg_rating FLOAT;
  v_avg_food FLOAT;
  v_avg_drink FLOAT;
  v_avg_ambiance FLOAT;
  v_avg_service FLOAT;
  v_avg_price FLOAT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_buteco_id := OLD.buteco_id;
  ELSE
    v_buteco_id := NEW.buteco_id;
  END IF;

  -- Coletar médias das reviews do buteco
  SELECT
    COALESCE(AVG(rating), 0),
    COALESCE(AVG(food), 0),
    COALESCE(AVG(drink), 0),
    COALESCE(AVG(ambiance), 0),
    COALESCE(AVG(service), 0),
    COALESCE(AVG(price), 0)
  INTO
    v_avg_rating,
    v_avg_food,
    v_avg_drink,
    v_avg_ambiance,
    v_avg_service,
    v_avg_price
  FROM "Review"
  WHERE buteco_id = v_buteco_id;

  -- Atualizar a tabela Buteco com os novos valores
  UPDATE "Buteco"
  SET rating = v_avg_rating,
      food = v_avg_food,
      drink = v_avg_drink,
      ambiance = v_avg_ambiance,
      service = v_avg_service,
      price = v_avg_price
  WHERE id = v_buteco_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Função: atualizar_has_evaluated (INSERT)
CREATE OR REPLACE FUNCTION update_has_evaluated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "CheckInParticipant"
  SET "hasEvaluated" = TRUE
  WHERE "userId" = NEW.user_id
    AND "checkInId" IN (
      SELECT id FROM "CheckIn" WHERE "butecoId" = NEW.buteco_id
    );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Função: desfazer_has_evaluated (DELETE)
CREATE OR REPLACE FUNCTION undo_has_evaluated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "CheckInParticipant"
  SET "hasEvaluated" = FALSE
  WHERE "userId" = OLD.user_id
    AND "checkInId" IN (
      SELECT id FROM "CheckIn" WHERE "butecoId" = OLD.buteco_id
    )
    AND NOT EXISTS (
      SELECT 1 FROM "Review"
      WHERE user_id = OLD.user_id
        AND buteco_id = OLD.buteco_id
    );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_update_rating ON "Review";
CREATE TRIGGER trigger_update_rating
AFTER INSERT OR UPDATE OR DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_rating_buteco();

DROP TRIGGER IF EXISTS trigger_update_has_evaluated ON "Review";
CREATE TRIGGER trigger_update_has_evaluated
AFTER INSERT ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_has_evaluated();

DROP TRIGGER IF EXISTS trigger_undo_has_evaluated ON "Review";
CREATE TRIGGER trigger_undo_has_evaluated
AFTER DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION undo_has_evaluated();
