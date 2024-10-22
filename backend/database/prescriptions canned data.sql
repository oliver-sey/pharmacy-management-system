-- To delete all prescriptions, truncate the table
-- TRUNCATE TABLE prescriptions;

INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (1, 3, 1, '2024-09-28', '2024-09-30 09:22:13', 2, 'Dr. Matthews', 50);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (2, 17, 5, '2024-09-10', '2024-09-12 11:18:45', 3, 'Dr. Philips', 20);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (3, 21, 24, '2024-08-05', '2024-08-06 14:47:59', 6, 'Dr. Greene', 100);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (1, 10, 10, '2024-09-29', '2024-09-30 12:10:22', 2, 'Dr. Stanley', 500);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (17, 12, 14, '2024-09-01', '2024-09-02 10:03:11', 7, 'Dr. Wills', 200);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (1, 11, 17, '2024-07-15', '2024-07-17 09:35:44', 11, 'Dr. Matthews', 50);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (5, 12, 21, '2024-09-25', '2024-09-26 14:22:30', 15, 'Dr. Hall', 12);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (16, 22, 24, '2024-09-29', '2024-09-30 15:45:15', 17, 'Dr. Squatch', 1000);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (17, 6, 5, '2024-09-29', '2024-09-30 12:10:22', 2, 'Dr. Oz', 25);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (17, 1, 9, '2024-09-01', '2024-09-02 10:03:11', 7, 'Dr. Oz', 200);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (21, 19, 10, '2024-07-15', '2024-09-17 11:34:44', 15, 'Dr. Doofenschmirz', 12);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (20, 24, 14, '2024-09-02', '2024-09-26 14:42:30', 2, 'Dr. Hall', 12);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (21, 2, 1, '2024-09-29', '2024-09-30 15:12:15', 17, 'Dr. Carter', 90);
