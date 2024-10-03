-- a script to insert some canned data to Transaction. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE transactions;



INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (1, 5, 1, '2024-09-30 14:35:18', 'credit card');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (2, 6, 2, '2024-09-13 12:23:57', 'cash');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (3, 7, 3, '2024-08-07 16:05:32', 'debit card');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (4, 8, 1, '2024-09-30 16:52:10', 'cash');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (5, 6, 4, '2024-09-03 09:15:43', 'credit card');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (6, 9, 1, '2024-07-18 10:47:29', 'debit card');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (7, 10, 5, '2024-09-27 11:53:02', 'cash');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (8, 11, 6, '2024-10-01 09:32:12', 'credit card');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (9, 12, 7, '2024-09-30 14:40:37', 'debit card');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (10, 13, 7, '2024-09-03 12:25:15', 'cash');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (11, 15, 0, '2024-09-27 17:14:29', 'debit card');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (12, 16, 1, '2024-10-01 09:57:41', 'cash');
INSERT INTO transactions (id, user_id, patient_id, timestamp, payment_method) VALUES (13, 14, 1, '2024-10-02 14:12:34', 'credit card');
