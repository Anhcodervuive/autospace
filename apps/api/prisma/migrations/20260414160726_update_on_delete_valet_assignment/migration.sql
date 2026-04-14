-- DropForeignKey
ALTER TABLE "public"."BookingTimeline" DROP CONSTRAINT "BookingTimeline_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookingTimeline" DROP CONSTRAINT "BookingTimeline_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookingTimeline" DROP CONSTRAINT "BookingTimeline_valet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ValetAssignment" DROP CONSTRAINT "ValetAssignment_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ValetAssignment" DROP CONSTRAINT "ValetAssignment_pickup_valet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ValetAssignment" DROP CONSTRAINT "ValetAssignment_return_valet_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."ValetAssignment" ADD CONSTRAINT "ValetAssignment_pickup_valet_id_fkey" FOREIGN KEY ("pickup_valet_id") REFERENCES "public"."Valet"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValetAssignment" ADD CONSTRAINT "ValetAssignment_return_valet_id_fkey" FOREIGN KEY ("return_valet_id") REFERENCES "public"."Valet"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValetAssignment" ADD CONSTRAINT "ValetAssignment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingTimeline" ADD CONSTRAINT "BookingTimeline_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingTimeline" ADD CONSTRAINT "BookingTimeline_valet_id_fkey" FOREIGN KEY ("valet_id") REFERENCES "public"."Valet"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingTimeline" ADD CONSTRAINT "BookingTimeline_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."Manager"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
