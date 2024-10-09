-- a script to insert some canned data to InventoryUpdate. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE inventory_updates;


-- TODO: need to come up with user_activity_id's, and figure out type (if it should be in the DB or not)

INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (1, 1, 2, ____, 500, '2024-09-01 08:35:00', NULL, 'add');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (2, 2, 2, ____, -1000, '2024-09-30 08:42:10', NULL, 'discard');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (3, 3, 8, ____, -500, '2024-09-12 11:00:40', NULL, 'discard');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (4, 2, 21, ____, -1, '2024-09-30 14:35:00', 1, 'fillpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (5, 3, 19, ____, 5, '2024-09-13 12:23:00', 2, 'add');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (6, 6, 5, ____, -1, '2024-08-07 16:05:00', 3, 'fillpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (7, 8, 8, ____, 10, '2024-09-30 16:52:00', 4, 'add');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (8, 11, 7, ____, -3, '2024-09-03 09:15:00', 5, 'sellnonpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (9, 2, 21, ____, -1, '2024-07-18 10:47:00', 6, 'fillpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (10, 15, 10, ____, -1, '2024-09-27 11:53:00', 7, 'fillpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (11, 17, 19, ____, 6, '2024-10-01 09:32:00', 8, 'add');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (12, 17, 9, ____, -2, '2024-09-30 14:40:00', 9, 'sellnonpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (13, 17, 13, ____, -1, '2024-09-03 12:25:00', 10, 'sellnonpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (14, 14, 15, ____, -1, '2024-09-27 17:14:00', 11, 'sellnonpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (15, 17, 16, ____, -1, '2024-10-01 09:57:00', 12, 'sellnonpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (16, 17, 17, ____, -1, '2024-10-02 14:12:00', 13, 'fillpresc');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (17, 8, 19, ____, -5, '2024-09-29 15:10:00', 14, 'discard');
INSERT INTO inventory_updates(id, medication_id, user_activity_id, user_id, quantity, timestamp, transaction_id, type) VALUES (18, 5, 14, ____, -1, '2024-09-30 10:23:00', 15, 'fillpresc');
