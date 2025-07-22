-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "invitedById" TEXT,
    "acceptedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Buteco" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ambiance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "drink" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "food" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "service" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Buteco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "butecoId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckInParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "hasEvaluated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckInParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "buteco_id" TEXT NOT NULL,
    "food" INTEGER NOT NULL,
    "drink" INTEGER NOT NULL,
    "service" INTEGER NOT NULL,
    "ambiance" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkInId" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "buteco_id" TEXT NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "CheckInParticipant_userId_checkInId_key" ON "CheckInParticipant"("userId", "checkInId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_user_id_buteco_id_key" ON "Review"("user_id", "buteco_id");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_butecoId_fkey" FOREIGN KEY ("butecoId") REFERENCES "Buteco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInParticipant" ADD CONSTRAINT "CheckInParticipant_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInParticipant" ADD CONSTRAINT "CheckInParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_buteco_id_fkey" FOREIGN KEY ("buteco_id") REFERENCES "Buteco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_buteco_id_fkey" FOREIGN KEY ("buteco_id") REFERENCES "Buteco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- FUNCTIONS
CREATE FUNCTION public.undo_has_evaluated() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.undo_has_evaluated() OWNER TO neondb_owner;

--
-- Name: update_has_evaluated(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_has_evaluated() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE "CheckInParticipant"
  SET "hasEvaluated" = TRUE
  WHERE "userId" = NEW.user_id
    AND "checkInId" IN (
      SELECT id FROM "CheckIn" WHERE "butecoId" = NEW.buteco_id
    );

  RETURN NULL;
END;
$$;


ALTER FUNCTION public.update_has_evaluated() OWNER TO neondb_owner;

--
-- Name: update_rating_buteco(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_rating_buteco() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_buteco_id TEXT;
  v_avg_rating DECIMAL;
  v_avg_food DECIMAL;
  v_avg_drink DECIMAL;
  v_avg_ambiance DECIMAL;
  v_avg_service DECIMAL;
  v_avg_price DECIMAL;
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
$$;


ALTER FUNCTION public.update_rating_buteco() OWNER TO neondb_owner;

-- TRIGGERS
-- Name: Review trigger_undo_has_evaluated; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_undo_has_evaluated AFTER DELETE ON public."Review" FOR EACH ROW EXECUTE FUNCTION public.undo_has_evaluated();


--
-- Name: Review trigger_update_has_evaluated; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_update_has_evaluated AFTER INSERT ON public."Review" FOR EACH ROW EXECUTE FUNCTION public.update_has_evaluated();


--
-- Name: Review trigger_update_rating; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_update_rating AFTER INSERT OR DELETE OR UPDATE ON public."Review" FOR EACH ROW EXECUTE FUNCTION public.update_rating_buteco();


--
