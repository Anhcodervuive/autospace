-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_slot_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "public"."Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
