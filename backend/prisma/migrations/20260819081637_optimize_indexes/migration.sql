-- Indexing pass driven by actual query patterns in the codebase (see comments in
-- schema.prisma next to each new index), not a blanket "index everything":
--   * Composite indexes replace single-column ones they make redundant (a composite's
--     leftmost prefix already serves the single-column lookup, so keeping both is dead
--     weight — extra write cost with zero read benefit).
--   * `guests_email_idx` / `guests_phone_idx` are dropped outright: `email` and `phone`
--     are already `@unique`, which creates its own index — a second plain index on the
--     same column was pure duplication.
--   * New indexes are added only for tables that actually grow over the app's lifetime
--     and are queried on real hot paths (bookings, payments, guests, reviews, service
--     orders, housekeeping logs, extra services) — small reference tables (rooms, room
--     types, amenities, admins, staff) are left alone since a full scan of a few hundred
--     rows is already effectively free and doesn't get slower over time.
--
-- New composite/replacement indexes are created before the single-column indexes they
-- replace are dropped, so an existing foreign-key constraint always has a valid
-- supporting index to fall back on mid-migration.

-- CreateIndex (bookings)
CREATE INDEX `bookings_guestId_status_idx` ON `bookings`(`guestId`, `status`);
CREATE INDEX `bookings_roomId_status_idx` ON `bookings`(`roomId`, `status`);
CREATE INDEX `bookings_status_createdAt_idx` ON `bookings`(`status`, `createdAt`);
CREATE INDEX `bookings_checkOut_idx` ON `bookings`(`checkOut`);

-- DropIndex (bookings) — superseded by the composites above
DROP INDEX `bookings_guestId_idx` ON `bookings`;
DROP INDEX `bookings_roomId_idx` ON `bookings`;
DROP INDEX `bookings_status_idx` ON `bookings`;

-- CreateIndex (payments)
CREATE INDEX `payments_status_createdAt_idx` ON `payments`(`status`, `createdAt`);

-- DropIndex (payments) — superseded by the composite above
DROP INDEX `payments_status_idx` ON `payments`;

-- CreateIndex (guests)
CREATE INDEX `guests_createdAt_idx` ON `guests`(`createdAt`);
CREATE INDEX `guests_totalSpent_idx` ON `guests`(`totalSpent`);

-- DropIndex (guests) — redundant with the @unique constraints on these columns
DROP INDEX `guests_email_idx` ON `guests`;
DROP INDEX `guests_phone_idx` ON `guests`;

-- CreateIndex (reviews)
CREATE INDEX `reviews_roomTypeId_status_idx` ON `reviews`(`roomTypeId`, `status`);
CREATE INDEX `reviews_status_createdAt_idx` ON `reviews`(`status`, `createdAt`);

-- DropIndex (reviews) — superseded by the composite above
DROP INDEX `reviews_roomTypeId_idx` ON `reviews`;

-- CreateIndex (service_orders)
CREATE INDEX `service_orders_status_createdAt_idx` ON `service_orders`(`status`, `createdAt`);

-- DropIndex (service_orders) — superseded by the composite above
DROP INDEX `service_orders_status_idx` ON `service_orders`;

-- CreateIndex (housekeeping_logs)
CREATE INDEX `housekeeping_logs_roomId_createdAt_idx` ON `housekeeping_logs`(`roomId`, `createdAt`);

-- DropIndex (housekeeping_logs) — superseded by the composite above
DROP INDEX `housekeeping_logs_roomId_idx` ON `housekeeping_logs`;

-- CreateIndex (extra_services) — table had no secondary indexes at all before this
CREATE INDEX `extra_services_active_createdAt_idx` ON `extra_services`(`active`, `createdAt`);
