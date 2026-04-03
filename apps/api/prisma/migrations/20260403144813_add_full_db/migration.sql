/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SlotType" AS ENUM ('CAR', 'HEAVY', 'BIKE', 'BICYCLE');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('BOOKED', 'VALET_ASSIGNED_FOR_CHECK_IN', 'VALET_PICKED_UP', 'CHECKED_IN', 'VALET_ASSIGNED_FOR_CHECK_OUT', 'CHECKED_OUT', 'VALET_RETURNED');

-- AlterTable
ALTER TABLE "public"."Admin" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Manager" (
    "uid" TEXT NOT NULL,
    "display_name" TEXT,
    "company_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Valet" (
    "uid" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "image" TEXT,
    "licence_id" TEXT NOT NULL DEFAULT '',
    "company_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Valet_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "uid" TEXT NOT NULL,
    "display_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "display_name" TEXT,
    "description" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Garage" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "images" TEXT[],
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "Garage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Verification" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "admin_id" TEXT NOT NULL,
    "garage_id" INTEGER NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("garage_id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "garage_id" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Slot" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "display_name" TEXT,
    "price_per_hour" DOUBLE PRECISION NOT NULL,
    "length" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "type" "public"."SlotType" NOT NULL DEFAULT 'CAR',
    "garage_id" INTEGER NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "price_per_hour" DOUBLE PRECISION,
    "total_price" DOUBLE PRECISION,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "phone_number" TEXT,
    "passcode" TEXT,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'BOOKED',
    "slot_id" INTEGER NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ValetAssignment" (
    "booking_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pickup_lat" DOUBLE PRECISION,
    "pickup_lng" DOUBLE PRECISION,
    "return_lat" DOUBLE PRECISION,
    "return_lng" DOUBLE PRECISION,
    "pickup_valet_id" TEXT,
    "return_valet_id" TEXT,

    CONSTRAINT "ValetAssignment_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "public"."BookingTimeline" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."BookingStatus" NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "valet_id" TEXT,
    "manager_id" TEXT,

    CONSTRAINT "BookingTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "customer_id" TEXT NOT NULL,
    "garage_id" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Valet_company_id_uid_key" ON "public"."Valet"("company_id", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "Address_garage_id_key" ON "public"."Address"("garage_id");

-- CreateIndex
CREATE INDEX "Booking_start_time_end_time_idx" ON "public"."Booking"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "BookingTimeline_booking_id_idx" ON "public"."BookingTimeline"("booking_id");

-- AddForeignKey
ALTER TABLE "public"."Manager" ADD CONSTRAINT "Manager_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Manager" ADD CONSTRAINT "Manager_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Valet" ADD CONSTRAINT "Valet_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Valet" ADD CONSTRAINT "Valet_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Garage" ADD CONSTRAINT "Garage_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Verification" ADD CONSTRAINT "Verification_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."Admin"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Verification" ADD CONSTRAINT "Verification_garage_id_fkey" FOREIGN KEY ("garage_id") REFERENCES "public"."Garage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_garage_id_fkey" FOREIGN KEY ("garage_id") REFERENCES "public"."Garage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Slot" ADD CONSTRAINT "Slot_garage_id_fkey" FOREIGN KEY ("garage_id") REFERENCES "public"."Garage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "public"."Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValetAssignment" ADD CONSTRAINT "ValetAssignment_pickup_valet_id_fkey" FOREIGN KEY ("pickup_valet_id") REFERENCES "public"."Valet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValetAssignment" ADD CONSTRAINT "ValetAssignment_return_valet_id_fkey" FOREIGN KEY ("return_valet_id") REFERENCES "public"."Valet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValetAssignment" ADD CONSTRAINT "ValetAssignment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingTimeline" ADD CONSTRAINT "BookingTimeline_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingTimeline" ADD CONSTRAINT "BookingTimeline_valet_id_fkey" FOREIGN KEY ("valet_id") REFERENCES "public"."Valet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingTimeline" ADD CONSTRAINT "BookingTimeline_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."Manager"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_garage_id_fkey" FOREIGN KEY ("garage_id") REFERENCES "public"."Garage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
