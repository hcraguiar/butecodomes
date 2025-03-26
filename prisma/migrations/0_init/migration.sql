-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
    "rating" DOUBLE PRECISION,

    CONSTRAINT "Buteco_pkey" PRIMARY KEY ("id")
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "buteco_id" TEXT NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_buteco_id_fkey" FOREIGN KEY ("buteco_id") REFERENCES "Buteco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_buteco_id_fkey" FOREIGN KEY ("buteco_id") REFERENCES "Buteco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

