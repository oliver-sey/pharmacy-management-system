-- a script to insert some canned data to InventoryUpdate. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE inventory_updates;


INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (1, 2, 500, '2024-09-01 08:35:00', NULL, 'add');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (2, 2, -1000, '2024-09-30 08:42:10', NULL, 'discard');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (3, 8, -500, '2024-09-12 11:00:40', NULL, 'discard');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (2, 21, -1, '2024-09-30 14:35:00', 1, 'fillpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (3, 19, 5, '2024-09-13 12:23:00', 2, 'add');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (6, 5, -1, '2024-08-07 16:05:00', 3, 'fillpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (8, 8, 10, '2024-09-30 16:52:00', 4, 'add');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (11, 7, -3, '2024-09-03 09:15:00', 5, 'sellnonpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (2, 21, -1, '2024-07-18 10:47:00', 6, 'fillpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (15, 10, -1, '2024-09-27 11:53:00', 7, 'fillpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (17, 19, 6, '2024-10-01 09:32:00', 8, 'add');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (17, 9, -2, '2024-09-30 14:40:00', 9, 'sellnonpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (17, 13, -1, '2024-09-03 12:25:00', 10, 'sellnonpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (14, 15, -1, '2024-09-27 17:14:00', 11, 'sellnonpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (17, 16, -1, '2024-10-01 09:57:00', 12, 'sellnonpresc');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, type) VALUES (17, 17, -1, '2024-10-02 14:12:00', 13, 'fillpresc');
