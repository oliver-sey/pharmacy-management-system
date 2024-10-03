-- a script to insert some canned data to Prescription. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE prescriptions;


INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (1, 1, 3, 1, '2024-09-28	2024-09-30 09:22:13' '500mg', 'Dr. Matthews', 2);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (2, 2, 17, 5, '2024-09-10	2024-09-12 11:18:45' '20mg', 'Dr. Philips', 3);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (3, 3, 21, 24, '2024-08-05	2024-08-06 14:47:59' '100mg', 'Dr. Greene', 6);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (4, 1, 10, 10, '2024-09-29	2024-09-30 12:10:22' '500mg', 'Dr. Stanley', 2);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (5, 17, 12, 14, '2024-09-01	2024-09-02 10:03:11' '200mg', 'Dr. Wills', 7);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (6, 1, 11, 17, '2024-07-15	2024-07-17 09:35:44' '500mg', 'Dr. Matthews', 11);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (7, 5, 12, 21, '2024-09-25	2024-09-26 14:22:30' '12.5mg', 'Dr. Hall', 15);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (8, 16, 22, 24, '2024-09-29	2024-09-30 15:45:15' '1000mg', 'Dr. Squatch', 17);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (9, 17, 6, 5, '2024-09-29	2024-09-30 12:10:22' '500mg', 'Dr. Oz', 2);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (10, 17, 1, 9, '2024-09-01	2024-09-02 10:03:11' '200mg', 'Dr. Oz', 7);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (11, 21, 19, 10, '2024-07-15	2024-09-17 11:34:44' '12.5mg', 'Dr. Doofenschmirz', 15);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (12, 20, 24, 14, '2024-09-02	2024-09-26 14:42:30' '12.5mg', 'Dr. Hall', 2);
INSERT INTO prescriptions (id, patient_id, user_entered_id, user_filled_id, dosage, doctor_name, medication_id, date_prescribed, timestamp_filled) VALUES (13, 21, 2, 1, '2024-09-29	2024-09-30 15:12:15' '1000mg', 'Dr. Carter', 17);
