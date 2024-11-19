-- a script to insert some canned data into the database. 
-- The data in each table connects with (and should make sense with) all the other tables of canned data

-- HOW TO RUN: 
-- open a query editor in PGAdmin
-- copy paste this script into the query editor (in this order, this way there are no issues with the relationships)




-- order:
-- 1. users
-- 2. patients (doesn't really matter between users and patients)
-- 3. medications
-- 4. prescriptions
-- 5. user_activities
-- 6. transactions
-- 7. inventory_updates


-- ****** truncate (get rid of all rows) and restart the counting on ID's from 0, for all tables
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE patients RESTART IDENTITY CASCADE;
TRUNCATE TABLE medications RESTART IDENTITY CASCADE;
TRUNCATE TABLE prescriptions RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_activities RESTART IDENTITY CASCADE;
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE inventory_updates RESTART IDENTITY CASCADE;



-- users table
-- *******NOTE: all passwords are 'password'
    
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Alice', 'Stevenson', 'PHARMACIST', 'alice.pharm@example.com', '$2b$12$XKDWZkY0V0My9d/EBIawCOqRE283Jzt8d6m5Jc.kUdVhW8ZouhNfG', FALSE); -- id #1
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Oliver', 'Seemorebutts', 'PHARMACY_MANAGER', 'oliver@cool.com', '$2b$12$Uc9QHInwXBCdOzp4KxscK.63TuCusz2Ax7RariEJhi1LOv53wR.0e', FALSE); -- id #2
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Carol', 'Davies', 'PHARMACY_TECHNICIAN', 'carol.tech@example.com', '$2b$12$tT7e.YEtU6eoxCYH3LUGqO.0kLWehKA80D/hMEtH/lv3zZvO4m.Qy', FALSE); -- id #3
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Dave', 'Frank', 'CASHIER', 'dave.cashier@example.com', '$2b$12$wjGUxF0.1fMW6KI3CAk9k.HHqs0rLTMnnLSAAChEfFdG5HzthAeAa', FALSE); -- id #4
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Eve', 'Barrancato', 'PHARMACIST', 'eve.pharm@example.com', '$2b$12$XvdHJgssaYJeiFYqAUxrUeYdJxouAUwmLrWv2G8OWn1AUeuUhvILW', FALSE); -- id #5
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Frank', 'Wright', 'PHARMACY_TECHNICIAN', 'frank.tech@example.com', '$2b$12$7CjTRY.PQgUKvNMdq5vro.WncpDTfJ20rv5mog14ZZS92gpJkPGna', FALSE); -- id #6
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Gina', 'Cler', 'CASHIER', 'gina.cashier@example.com', '$2b$12$3KOSxmCBEj7fdL/TOhTVCeoiii1BrEvnPakKudbN5Zw5ft3QYbZCK', FALSE); -- id #7
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Hank', 'Oldman', 'PHARMACY_MANAGER', 'hank.manager@example.com', '$2b$12$.YR6KLtrv9ixoyrT6ZYHWOoO./Z2nofz6FslK37YHQwTjWhdYxwA.', FALSE); -- id #8
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Isabel', 'Raudies', 'PHARMACY_TECHNICIAN', 'isabel.tech@example.com', '$2b$12$Og054nBFVNBk1Z/.DCFXbuVoVqXsSMH73drcCJSCo92pNV4pOa2Ua', FALSE); -- id #9
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('James', 'Delp', 'PHARMACIST', 'james.pharm@example.com', '$2b$12$QWeyx9Xd4LUaZfBSO2gzb.m4WRtxqByVmoTa7FETf3VsCHadOdLlu', FALSE); -- id #10
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Kelly', 'Clarkson', 'CASHIER', 'kelly.cashier@example.com', '$2b$12$SOYO9rO.C11Vi/YjLZO0BeXKREjzlQtgOT8nz6QLLc8m6hmP8M3U6', FALSE); -- id #11
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Leo', 'Girolami', 'PHARMACY_MANAGER', 'leo.manager@example.com', '$2b$12$xSoMrbLG.Jmph0gZffwlx.VDgu3BaTg55b3tDUrP4fuK5Pl21PPi.', FALSE); -- id #12
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Mary', 'Olsen', 'PHARMACY_TECHNICIAN', 'mary.tech@example.com', '$2b$12$o0QFdyhJ3APZ.n86Qnz0yeFLM8gC0iFnuj5UCoktEROhwT1Kj/.jW', FALSE); -- id #13
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Nora', 'Newman', 'PHARMACIST', 'nora.pharm@example.com', '$2b$12$OqhWdhVXGMFsJGwrrzlnhefrC7tvkBavYaTLVTihOmfTIdUA9nVTm', FALSE); -- id #14
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Oscar', 'Piastri', 'CASHIER', 'oscar.cashier@example.com', '$2b$12$3jjuQ46cDX9V.CrtVImCKObqlJtZTGChvfvVuIx41R1q/uUDBw.vO', FALSE); -- id #15
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Paul', 'Downs', 'PHARMACY_TECHNICIAN', 'paul.tech@example.com', '$2b$12$Q8T7tbeI3pqoVAt8RBbP9.U4/QIZyHYwhV7ngBPO/F/QRv0FuaCvS', FALSE); -- id #16
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Quinn', 'Cooney', 'PHARMACIST', 'quinn.pharm@example.com', '$2b$12$Ka7Xrs2V6Pe8p26Z2w/72u135/EDZ/kkdGx6AjPfCAMo5nZ3AMJPu', TRUE); -- id #17
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Rachel', 'Davidson', 'CASHIER', 'rachel.cashier@example.com', '$2b$12$C9BgHch0jB08.S.Fi56A9uJvQcjl.QGeCsClcEfE9S2JorfB99bTS', FALSE); -- id #18
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Steve', 'Madden', 'PHARMACY_MANAGER', 'steve.manager@example.com', '$2b$12$ObhfnA0QrGimKzb8EJ6G8OMUDj0JeeZxUZU7LdebIoEreTc7arOh6', FALSE); -- id #19
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Tony', 'Hawk', 'PHARMACY_TECHNICIAN', 'tony.tech@example.com', '$2b$12$GM0mN.jf3aI2oEFsP7EMYOQLHugNoucUJvFzimIcW8Y/pShUviG4W', TRUE); -- id #20
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Ursula', 'Van Schothorst', 'PHARMACIST', 'ursula.pharm@example.com', '$2b$12$gYMWcFOnIBwMxQjNkWblF.wUel9fnB6gBzVXulLnD4jNLLP1OP7ca', FALSE); -- id #21
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Victor', 'Franks', 'CASHIER', 'victor.cashier@example.com', '$2b$12$CGWK9XeQAr5HneYf4nIf0evXaNBJ058oGOfB45.rEke//g8ruKSUi', FALSE); -- id #22
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Wanda', 'Notlost', 'PHARMACY_TECHNICIAN', 'wanda.tech@example.com', '$2b$12$xnrmNLHgSjjfECF5IueZEO8LatXlwiBEqeFSKdnXAnsJepODU9ckC', FALSE); -- id #23
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Xander', 'Didrickson', 'PHARMACIST', 'xander.pharm@example.com', '$2b$12$TcQ10ZsnubBJuJPp/bZU0ON/sqwQHkRbbxC09hcCFJj.rWCVC/YfO', TRUE); -- id #24
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Yvette', 'Cooms', 'PHARMACY_MANAGER', 'yvette.manager@example.com', '$2b$12$uC8NOm5OgKuzD6be9MMvX.Ik6FnvL81Fgq6Tgsha3e3zpul6F21lK', FALSE); -- id #25
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Steve', 'Lastname', 'PHARMACY_MANAGER', 'user@user.com', '$2b$12$wDmlYBX1ju6tZ8qj8tlo1uh2QtsJlw21CdN18wGf9G8UhseTpIEFq', FALSE); -- id #25




-- patients table

    
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('John', 'Doe', '1985-04-12',	'123 Main St', '123-456-7890', 'john.doe@randommail.com', 'HealthCarePlus', 12345, 'MEM10001'); -- id #1
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Jane', 'Smith', '1990-09-21',	'456 Oak St', '234-567-8901', 'jane.smith@randommail.com', 'MediShield', 69636969, '1236532'); -- id #2
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Mike', 'Johnson', '1975-07-19',	'789 Pine St', '345-678-9012', 'mike.johnson@randommail.com', 'HealthCarePlus', 12345, 'MEM10003'); -- id #3
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Emma', 'Williams', '2000-12-05',	'111 Birch St', '456-789-0123', 'emma.williams@randommail.com', 'MediShield', 8888675, '123412'); -- id #4
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Sarah', 'Connor', '1978-05-10',	'22 Future Blvd', '555-555-5555', 'sarah.connor@randommail.com', 'OmniHealth', 54321, 'MEM10005'); -- id #5
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('David', 'Rogers', '1969-10-22',	'123 Elm St', '567-890-1234', 'david.rogers@randommail.com', 'HealthCarePlus', 23423423, '129192'); -- id #6
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Lucy', 'Adams', '1998-08-13',	'321 Cedar Ave', '678-901-2345', 'lucy.adams@randommail.com', 'OmniHealth', 54321, '132121241'); -- id #7
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Bruce', 'Wayne', '1972-02-19',	'654 Gotham Blvd', '789-012-3456', 'bruce.wayne@randommail.com', 'HealthCarePlus', 12345, '1243ACD1'); -- id #8
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Diana', 'Prince', '1995-03-30',	'789 Amazonian St', '890-123-4567', 'diana.prince@randommail.com', 'MediShield', 67890, 'MEM10009'); -- id #9
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Clark', 'Kent', '1979-12-15',	'1 Smallville Ln', '901-234-5678', 'clark.kent@randommail.com', 'OmniHealth', 54321, 'MEM10010'); -- id #10
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Peter', 'Parker', '2001-05-25',	'123 Spider Ave', '111-222-3333', 'peter.parker@randommail.com', 'HealthCarePlus', 12345, '123123WWqwA3'); -- id #11
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Tony', 'Stark', '1980-06-15',	'1 Stark Tower Dr', '444-555-6666', 'tony.stark@randommail.com', 'MediShield', 67890, 'MEM10012'); -- id #12
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Natasha', 'Romanoff', '1985-11-22',	'789 Widow St', '101-010-1010', 'natasha.romanoff@randommail.com', 'OmniHealth', 54321, 'MEM10013'); -- id #13
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Steve', 'Rogers', '1980-07-04',	'99 Shield Ave', '909-808-7070', 'steve.rogers@randommail.com', 'HealthCarePlus', 12345, 'MEM10014'); -- id #14
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Wanda', 'Maximoff', '1992-02-14',	'987 Hex Ln', '808-707-6060', 'wanda.maximoff@randommail.com', 'MediShield', 67890, 'MEM10015'); -- id #15
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Scott', 'Lang', '1985-04-06',	'321 Quantum Dr', '707-606-5050', 'scott.lang@randommail.com', 'OmniHealth', 54321, 'MEM10016'); -- id #16
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Bruce', 'Banner', '1969-12-18',	'543 Gamma Rd', '606-505-4040', 'bruce.banner@randommail.com', 'HealthCarePlus', 12345, 'MEM10017'); -- id #17
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Carol', 'Danvers', '1988-10-24',	'789 Photon Ln', '505-404-3030', 'carol.danvers@randommail.com', 'MediShield', 67890, 'MEM10018'); -- id #18
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Stephen', 'Strange', '1979-11-17',	'789 Mystic St', '404-303-2020', 'stephen.strange@randommail.com', 'OmniHealth', 54321, 'MEM10019'); -- id #19
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Peter', 'Quill', '1982-08-21',	'123 Star Rd', '303-202-1010', 'peter.quill@randommail.com', 'HealthCarePlus', 12345, 'MEM10020'); -- id #20
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Gamora', 'Zen Whoberi',	'1985-06-23',	'987 Titan Rd', '202-101-9999', 'gamora.zen@randommail.com', 'MediShield', 67890, 'MEM10021'); -- id #21
INSERT INTO patients(first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_number, insurance_member_id) VALUES ('Bucky', 'Barnes', '1917-03-10',	'99 Winter St', '808-999-8888', 'bucky.barnes@randommail.com', 'HealthCarePlus', 12345, 'MEM10022'); -- id #22



-- medications table

INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Ibuprofen', '200 mg', 500, FALSE, '2025-05-10', 0.1);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Amoxicillin', '500 mg', 200, TRUE, '2024-12-01', 2);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Lipitor', '20 mg', 300, TRUE, '2026-03-15', 0.75);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Acetaminophen', '500 mg', 1000, FALSE, '2025-11-30', 0.08);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Aspirin', '100 mg', 500, FALSE, '2024-07-22', 0.05);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Warfarin', '2.5 grams', 150, TRUE, '2024-10-10', 1.5);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Metformin', '850 mg', 400, TRUE, '2025-02-14', 0.5);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Melatonin', '20mL', 5, FALSE, '2024-10-31', 0.0004);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Dramamine', '1000 mg', 1200, FALSE, '2021-10-01', 0.51);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Ibuprofen', '200 mg', 500, FALSE, '2025-05-10', 0.1);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Amoxicillin', '500 mg', 100, TRUE, '2024-12-01', 2);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Lipitor', '20 mg', 300, TRUE, '2026-03-15', 0.75);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Acetaminophen', '500 mg', 1000, FALSE, '2025-11-30', 0.08);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Aspirin', '100 nanograms', 200, FALSE, '2024-07-22', 0.05);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Hydrochlorothiazide', '12.5 mg', 600, TRUE, '2026-02-18', 0.5);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Simvastatin', '40 mg', 1, TRUE, '2025-09-20', 1.1);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Metformin', '1000 mg', 400, TRUE, '2026-05-23', 0.25);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Prednisone', '10 mg', 500, TRUE, '2024-10-05', 1.5);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Warfarin', '5g', 100, TRUE, '2025-04-20', 0.8);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Losartan', '50 grams', 200, TRUE, '2024-11-11', 1);
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Levothyroxine', '75 mg', 300, TRUE, '2026-01-01', 0.55);



-- prescriptions table

INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (1, 3, 1, '2024-09-28', '2024-09-30 09:22:13', 2, 'Dr. Matthews', 50);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (2, 17, null, '2024-09-10', null, 3, 'Dr. Philips', 20);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (3, 21, 24, '2024-08-05', '2024-08-06 14:47:59', 6, 'Dr. Greene', 100);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (1, 10, 10, '2024-09-29', '2024-09-30 12:10:22', 2, 'Dr. Stanley', 500);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (17, 12, null, '2024-09-01', null, 7, 'Dr. Wills', 200);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (1, 11, 17, '2024-07-15', '2024-07-17 09:35:44', 11, 'Dr. Matthews', 50);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (5, 12, null, '2024-09-25', null, 15, 'Dr. Hall', 12);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (16, 22, 24, '2024-09-29', '2024-09-30 15:45:15', 17, 'Dr. Squatch', 1000);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (17, 6, 5, '2024-09-29', '2024-09-30 12:10:22', 2, 'Dr. Oz', 25);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (17, 1, 9, '2024-09-01', '2024-09-02 10:03:11', 7, 'Dr. Oz', 200);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (21, 19, null, '2024-07-15', null, 15, 'Dr. Doofenschmirz', 12);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (20, 24, 14, '2024-09-02', '2024-09-26 14:42:30', 2, 'Dr. Hall', 12);
INSERT INTO prescriptions (patient_id, user_entered_id, user_filled_id, date_prescribed, filled_timestamp, medication_id, doctor_name, quantity) 
VALUES (21, 2, null, '2024-09-29', null, 17, 'Dr. Carter', 90);


-- user_activities table
_type
_type
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (21, 'INVENTORY_UPDATE', '2024-07-18 10:47:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (24, 'LOGIN', '2024-08-06 07:55:35');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (5, 'INVENTORY_UPDATE', '2024-08-07 16:05:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (2, 'LOGIN', '2024-09-01 11:00:18');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (2, 'UNLOCK_ACCOUNT', '2024-09-02 09:10:20');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (7, 'INVENTORY_UPDATE', '2024-09-03 09:15:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (13, 'INVENTORY_UPDATE', '2024-09-03 12:25:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (1, 'LOGIN', '2024-09-11 08:24:10');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (5, 'LOGIN', '2024-09-12 08:20:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (8, 'LOGIN', '2024-09-12 11:00:20');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (2, 'LOGOUT', '2024-09-12 11:45:30');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (8, 'INVENTORY_UPDATE', '2024-09-12 12:35:22');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (8, 'LOGOUT', '2024-09-12 12:37:50');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (19, 'INVENTORY_UPDATE', '2024-09-13 12:23:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (12, 'LOGIN', '2024-09-25 08:13:30');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (12, 'INVENTORY_UPDATE', '2024-09-25 08:45:30');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (12, 'LOGOUT', '2024-09-25 09:01:30');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (24, 'LOGIN', '2024-09-26 09:05:10');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (24, 'LOGIN', '2024-09-26 09:05:31');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (1, 'LOGOUT', '2024-09-26 10:15:10');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (5, 'LOGOUT', '2024-09-26 17:20:55');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (10, 'INVENTORY_UPDATE', '2024-09-27 11:53:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (15, 'INVENTORY_UPDATE', '2024-09-27 17:14:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (14, 'LOGIN', '2024-09-29 09:00:05');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (12, 'INVENTORY_UPDATE', '2024-09-29 10:12:45');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (19, 'INVENTORY_UPDATE', '2024-09-29 15:10:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (14, 'LOGOUT', '2024-09-29 17:45:20');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (20, 'LOGIN', '2024-09-30 08:00:12');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (1, 'LOGIN', '2024-09-30 08:01:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (3, 'INVENTORY_UPDATE', '2024-09-30 08:15:40');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (3, 'INVENTORY_UPDATE', '2024-09-30 08:20:10');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (14, 'INVENTORY_UPDATE', '2024-09-30 10:23:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (21, 'INVENTORY_UPDATE', '2024-09-30 14:35:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (9, 'INVENTORY_UPDATE', '2024-09-30 14:40:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (8, 'INVENTORY_UPDATE', '2024-09-30 16:52:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (1, 'LOGOUT', '2024-09-30 17:05:32');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (20, 'LOGOUT', '2024-09-30 18:00:25');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (19, 'INVENTORY_UPDATE', '2024-10-01 09:32:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (16, 'INVENTORY_UPDATE', '2024-10-01 09:57:00');
INSERT INTO user_activities (user_id, activity_type, timestamp) VALUES (17, 'INVENTORY_UPDATE', '2024-10-02 14:12:00');

-- transactions table_type
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (5, 1, '2024-09-30 14:35:18', 'credit card');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (6, 2, '2024-09-13 12:23:57', 'cash');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (7, 3, '2024-08-07 16:05:32', 'debit card');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (8, 1, '2024-09-30 16:52:10', 'cash');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (6, 4, '2024-09-03 09:15:43', 'credit card');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (9, 1, '2024-07-18 10:47:29', 'debit card');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (10, 5, '2024-09-27 11:53:02', 'cash');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (11, 6, '2024-10-01 09:32:12', 'credit card');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (12, 7, '2024-09-30 14:40:37', 'debit card');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (13, 7, '2024-09-03 12:25:15', 'cash');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (15, 3, '2024-09-27 17:14:29', 'debit card');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (16, 1, '2024-10-01 09:57:41', 'cash');
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method) VALUES (14, 1, '2024-10-02 14:12:34', 'credit card');


-- inventory_updates table


INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (1, 2, 500, '2024-09-01 08:35:00', NULL, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (2, 2, -1000, '2024-09-30 08:42:10', NULL, 'DISCARD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (3, 8, -500, '2024-09-12 11:00:40', NULL, 'DISCARD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (2, 21, -1, '2024-09-30 14:35:00', 1, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (3, 19, 5, '2024-09-13 12:23:00', 2, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (6, 5, -1, '2024-08-07 16:05:00', 3, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (8, 8, 10, '2024-09-30 16:52:00', 4, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (11, 7, -3, '2024-09-03 09:15:00', 5, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (2, 21, -1, '2024-07-18 10:47:00', 6, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (15, 10, -1, '2024-09-27 11:53:00', 7, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (17, 19, 6, '2024-10-01 09:32:00', 8, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (17, 9, -2, '2024-09-30 14:40:00', 9, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (17, 13, -1, '2024-09-03 12:25:00', 10, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (14, 15, -1, '2024-09-27 17:14:00', 11, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (17, 16, -1, '2024-10-01 09:57:00', 12, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, timestamp, transaction_id, activity_type) VALUES (17, 17, -1, '2024-10-02 14:12:00', 13, 'FILLPRESC');
