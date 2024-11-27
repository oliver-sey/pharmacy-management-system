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
    
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Alice', 'Stevenson', 'PHARMACIST', 'alice.pharm@example.com', '$2b$12$XKDWZkY0V0My9d/EBIawCOqRE283Jzt8d6m5Jc.kUdVhW8ZouhNfG', FALSE, FALSE); -- id #1
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Oliver', 'Seemorebutts', 'PHARMACY_MANAGER', 'oliver@cool.com', '$2b$12$Uc9QHInwXBCdOzp4KxscK.63TuCusz2Ax7RariEJhi1LOv53wR.0e', FALSE, FALSE); -- id #2
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Carol', 'Davies', 'PHARMACY_TECHNICIAN', 'carol.tech@example.com', '$2b$12$tT7e.YEtU6eoxCYH3LUGqO.0kLWehKA80D/hMEtH/lv3zZvO4m.Qy', FALSE, FALSE); -- id #3
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Dave', 'Frank', 'CASHIER', 'dave.cashier@example.com', '$2b$12$wjGUxF0.1fMW6KI3CAk9k.HHqs0rLTMnnLSAAChEfFdG5HzthAeAa', FALSE, FALSE); -- id #4
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Eve', 'Barrancato', 'PHARMACIST', 'eve.pharm@example.com', '$2b$12$XvdHJgssaYJeiFYqAUxrUeYdJxouAUwmLrWv2G8OWn1AUeuUhvILW', FALSE, FALSE); -- id #5
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Frank', 'Wright', 'PHARMACY_TECHNICIAN', 'frank.tech@example.com', '$2b$12$7CjTRY.PQgUKvNMdq5vro.WncpDTfJ20rv5mog14ZZS92gpJkPGna', FALSE, FALSE); -- id #6
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Gina', 'Cler', 'CASHIER', 'gina.cashier@example.com', '$2b$12$3KOSxmCBEj7fdL/TOhTVCeoiii1BrEvnPakKudbN5Zw5ft3QYbZCK', FALSE, FALSE); -- id #7
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Hank', 'Oldman', 'PHARMACY_MANAGER', 'hank.manager@example.com', '$2b$12$.YR6KLtrv9ixoyrT6ZYHWOoO./Z2nofz6FslK37YHQwTjWhdYxwA.', FALSE, FALSE); -- id #8
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Isabel', 'Raudies', 'PHARMACY_TECHNICIAN', 'isabel.tech@example.com', '$2b$12$Og054nBFVNBk1Z/.DCFXbuVoVqXsSMH73drcCJSCo92pNV4pOa2Ua', FALSE, FALSE); -- id #9
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('James', 'Delp', 'PHARMACIST', 'james.pharm@example.com', '$2b$12$QWeyx9Xd4LUaZfBSO2gzb.m4WRtxqByVmoTa7FETf3VsCHadOdLlu', FALSE, FALSE); -- id #10
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Kelly', 'Clarkson', 'CASHIER', 'kelly.cashier@example.com', '$2b$12$SOYO9rO.C11Vi/YjLZO0BeXKREjzlQtgOT8nz6QLLc8m6hmP8M3U6', FALSE, FALSE); -- id #11
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Leo', 'Girolami', 'PHARMACY_MANAGER', 'leo.manager@example.com', '$2b$12$xSoMrbLG.Jmph0gZffwlx.VDgu3BaTg55b3tDUrP4fuK5Pl21PPi.', FALSE, FALSE); -- id #12
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Mary', 'Olsen', 'PHARMACY_TECHNICIAN', 'mary.tech@example.com', '$2b$12$o0QFdyhJ3APZ.n86Qnz0yeFLM8gC0iFnuj5UCoktEROhwT1Kj/.jW', FALSE, FALSE); -- id #13
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Nora', 'Newman', 'PHARMACIST', 'nora.pharm@example.com', '$2b$12$OqhWdhVXGMFsJGwrrzlnhefrC7tvkBavYaTLVTihOmfTIdUA9nVTm', FALSE, FALSE); -- id #14
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Oscar', 'Piastri', 'CASHIER', 'oscar.cashier@example.com', '$2b$12$3jjuQ46cDX9V.CrtVImCKObqlJtZTGChvfvVuIx41R1q/uUDBw.vO', FALSE, FALSE); -- id #15
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Paul', 'Downs', 'PHARMACY_TECHNICIAN', 'paul.tech@example.com', '$2b$12$Q8T7tbeI3pqoVAt8RBbP9.U4/QIZyHYwhV7ngBPO/F/QRv0FuaCvS', FALSE, FALSE); -- id #16
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Quinn', 'Cooney', 'PHARMACIST', 'quinn.pharm@example.com', '$2b$12$Ka7Xrs2V6Pe8p26Z2w/72u135/EDZ/kkdGx6AjPfCAMo5nZ3AMJPu', TRUE, FALSE); -- id #17
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Rachel', 'Davidson', 'CASHIER', 'rachel.cashier@example.com', '$2b$12$C9BgHch0jB08.S.Fi56A9uJvQcjl.QGeCsClcEfE9S2JorfB99bTS', FALSE, FALSE); -- id #18
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Steve', 'Madden', 'PHARMACY_MANAGER', 'steve.manager@example.com', '$2b$12$ObhfnA0QrGimKzb8EJ6G8OMUDj0JeeZxUZU7LdebIoEreTc7arOh6', FALSE, FALSE); -- id #19
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Tony', 'Hawk', 'PHARMACY_TECHNICIAN', 'tony.tech@example.com', '$2b$12$GM0mN.jf3aI2oEFsP7EMYOQLHugNoucUJvFzimIcW8Y/pShUviG4W', TRUE, FALSE); -- id #20
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Ursula', 'Van Schothorst', 'PHARMACIST', 'ursula.pharm@example.com', '$2b$12$gYMWcFOnIBwMxQjNkWblF.wUel9fnB6gBzVXulLnD4jNLLP1OP7ca', FALSE, FALSE); -- id #21
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Victor', 'Franks', 'CASHIER', 'victor.cashier@example.com', '$2b$12$CGWK9XeQAr5HneYf4nIf0evXaNBJ058oGOfB45.rEke//g8ruKSUi', FALSE, FALSE); -- id #22
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Wanda', 'Notlost', 'PHARMACY_TECHNICIAN', 'wanda.tech@example.com', '$2b$12$xnrmNLHgSjjfECF5IueZEO8LatXlwiBEqeFSKdnXAnsJepODU9ckC', FALSE, FALSE); -- id #23
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Steve', 'Lastname', 'PHARMACY_MANAGER', 'user@user.com', '$2b$12$wDmlYBX1ju6tZ8qj8tlo1uh2QtsJlw21CdN18wGf9G8UhseTpIEFq', FALSE, FALSE); -- id #24
-- no passwords yet
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Bob', 'Nouveau', 'PHARMACY_MANAGER', 'bobnew@example.com', null, FALSE, FALSE); -- id #25
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Karen', 'Nopassword', 'CASHIER', 'nopassword@user.com', null, FALSE, FALSE); -- id #26

-- locked out users
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Steve', 'Lockedout', 'PHARMACY_MANAGER', 'lockedout@user.com', '$2b$12$wDmlYBX1ju6tZ8qj8tlo1uh2QtsJlw21CdN18wGf9G8UhseTpIEFq', TRUE, FALSE); -- id #27

-- deleted users
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Yvette', 'Cooms', 'PHARMACY_MANAGER', 'deleted@user.com', '$2b$12$uC8NOm5OgKuzD6be9MMvX.Ik6FnvL81Fgq6Tgsha3e3zpul6F21lK', FALSE, TRUE); -- id #28
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out, is_deleted) VALUES ('Xander', 'Didrickson', 'PHARMACIST', 'xander.pharm@example.com', '$2b$12$TcQ10ZsnubBJuJPp/bZU0ON/sqwQHkRbbxC09hcCFJj.rWCVC/YfO', TRUE, TRUE); -- id #29



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
VALUES('Ibuprofen', '200 mg', 500, FALSE, '2025-05-10', 0.15); -- id #1
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Amoxicillin', '500 mg', 200, TRUE, '2024-12-01', 0.3); -- id #2
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Lipitor', '20 mg', 300, TRUE, '2026-03-15', 0.5); -- id #3
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Acetaminophen', '500 mg', 1000, FALSE, '2025-11-30', 0.1); -- id #4
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Aspirin', '100 mg', 500, FALSE, '2024-07-22', 0.09); -- id #5
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Warfarin', '2.5 grams', 150, TRUE, '2024-10-10', 0.6); -- id #6
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Metformin', '850 mg', 400, TRUE, '2025-02-14', 0.03); -- id #7
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Melatonin', '20mL', 5, FALSE, '2024-10-31', 0.08); -- id #8
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Dramamine', '1000 mg', 1200, FALSE, '2021-10-01', 0.07); -- id #9
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Ibuprofen', '200 mg', 500, FALSE, '2025-05-10', 0.09); -- id #10
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Amoxicillin', '600 mg', 100, TRUE, '2024-12-01', 0.2); -- id #11
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Lipitor', '20 mg', 300, TRUE, '2026-03-15', 0.1); -- id #12
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Acetaminophen', '1000 mg', 1000, FALSE, '2025-11-30', 0.20); -- id #13
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Aspirin', '100 nanograms', 200, FALSE, '2024-07-22', 0.05); -- id #14
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Hydrochlorothiazide', '12.5 mg', 600, TRUE, '2026-02-18', 0.30); -- id #15
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Simvastatin', '40 mg', 1, TRUE, '2025-09-20', 0.2); -- id #16
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Metformin', '1000 mg', 400, TRUE, '2026-05-23', 0.03); -- id #17
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Prednisone', '10 mg', 500, TRUE, '2024-10-05', 0.2); -- id #18
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Warfarin', '5g', 100, TRUE, '2025-04-20', 0.06); -- id #19
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Losartan', '50 grams', 200, TRUE, '2024-11-11', 0.03); -- id #20
INSERT INTO medications(name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES('Levothyroxine', '75 mg', 300, TRUE, '2026-01-01', 0.04); -- id #21



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


-- transactions table
-- ****NOTE: total price includes tax but the subtotal prices in transaction_items do not!!!!!
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (5, 1, '2024-09-30 14:35:18', 'CASH', 25.48);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (6, 2, '2024-09-13 12:23:57', 'CREDIT_CARD', 8.10);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (7, 3, '2024-08-07 16:05:32', 'DEBIT_CARD', 1.62);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (8, 1, '2024-09-30 16:52:10', 'CREDIT_CARD', 7.61);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (6, 4, '2024-09-03 09:15:43', 'DEBIT_CARD', 4.32);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (9, 1, '2024-07-18 10:47:29', 'DEBIT_CARD', 21.06);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (10, 5, '2024-09-27 11:53:02', 'CASH', 9.72);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (11, 6, '2024-10-01 09:32:12', 'CREDIT_CARD', 200.88);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (12, 7, '2024-09-30 14:40:37', 'CREDIT_CARD', 3.78);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (13, 7, '2024-09-03 12:25:15', 'CASH', 4.32);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (15, 3, '2024-09-27 17:14:29', 'CREDIT_CARD', 24.94);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (16, 1, '2024-10-01 09:57:41', 'CASH', 3.88);
INSERT INTO transactions (user_id, patient_id, timestamp, payment_method, total_price) VALUES (14, 1, '2024-10-02 14:12:34', 'CREDIT_CARD', 3.24);


-- transaction_items table
-- Transaction 1
-- Total price (before tax): $23.6
-- Total price (with tax): 25.488 --> (truncate) $25.48
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (1, 1, 100, 15.0); -- Ibuprofen
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (1, 2, 10, 3.0); -- Amoxicillin
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (1, 4, 20, 2.0); -- Acetaminophen
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (1, 5, 40, 3.6); -- Aspirin

-- Transaction 2
-- Total price (before tax): $7.5
-- Total price (with tax): 8.10 --> (truncate) $8.10
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (2, 2, 10, 3.0); -- Amoxicillin
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (2, 5, 50, 4.5); -- Aspirin

-- Transaction 3
-- Total price (before tax): $1.5
-- Total price (with tax): 1.62 --> (truncate) $1.62
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (3, 3, 15, 1.5); -- Lipitor

-- Transaction 4
-- Total price (before tax): $7.05
-- Total price (with tax): 7.614 --> (truncate) $7.61
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (4, 6, 5, 3.0);  -- Warfarin
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (4, 1, 25, 3.75); -- Ibuprofen
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (4, 7, 10, 0.3); -- Metformin

-- Transaction 5
-- Total price (before tax): $4.0
-- Total price (with tax): 4.32 --> (truncate) $4.32
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (5, 4, 40, 4.0); -- Acetaminophen

-- Transaction 6
-- Total price (before tax): $19.5
-- Total price (with tax): 21.06 --> (truncate) $21.06
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (6, 8, 100, 8.0);  -- Melatonin
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (6, 9, 100, 7.0); -- Dramamine
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (6, 10, 50, 4.5); -- Ibuprofen

-- Transaction 7
-- Total price (before tax): $9.0
-- Total price (with tax): 9.72 --> (truncate) $9.72
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (7, 11, 20, 6.0); -- Amoxicillin
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (7, 12, 30, 3.0); -- Lipitor

-- Transaction 8
-- Total price (before tax): $186
-- Total price (with tax): 200.88 --> (truncate) $200.88
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (8, 11, 20, 6.0); -- Amoxicillin
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (8, 12, 300, 150.0); -- Lipitor
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (8, 13, 250, 25.0); -- Acetaminophen
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (8, 14, 100, 5.0); -- Aspirin

-- Transaction 9
-- Total price (before tax): $3.5
-- Total price (with tax): 3.78 --> (truncate) $3.78
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (9, 15, 5, 1.5);  -- Hydrochlorothiazide
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (9, 16, 10, 2.0);  -- Simvastatin

-- Transaction 10
-- Total price (before tax): $4.0
-- Total price (with tax): 4.32 --> (truncate) $4.32
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (10, 18, 20, 4.0); -- Prednisone

-- Transaction 11
-- Total price (before tax): $23.1
-- Total price (with tax): 24.948 --> (truncate) $24.94
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (11, 19, 10, 6.0); -- Warfarin
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (11, 20, 30, 9.0); -- Losartan
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (11, 10, 90, 8.1); -- Ibuprofen

-- Transaction 12
-- Total price (before tax): $3.6
-- Total price (with tax): 3.888 --> (truncate) $3.88
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (12, 21, 40, 1.6); -- Levothyroxine
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (12, 8, 25, 2.0); -- Melatonin

-- Transaction 13
-- Total price (before tax): $3.0
-- Total price (with tax): 3.24 --> (truncate) $3.24
INSERT INTO transaction_items (transaction_id, medication_id, quantity, subtotal_price) VALUES (13, 11, 15, 3.0); -- Amoxicillin




-- inventory_updates table


INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (1, 2, 1500, 500, '2024-09-01 08:35:00', NULL, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (2, 2, -1000, -500, '2024-09-30 08:42:10', NULL, 'DISCARD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (3, 8, -500, 0, '2024-09-12 11:00:40', NULL, 'DISCARD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (2, 21, -1, -501, '2024-09-30 14:35:00', 1, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (3, 19, 5, 5, '2024-09-13 12:23:00', 2, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (6, 5, -1, 9, '2024-08-07 16:05:00', 3, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (8, 8, 10, 10, '2024-09-30 16:52:00', 4, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (11, 7, -3, 17, '2024-09-03 09:15:00', 5, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (2, 21, -1, -502, '2024-07-18 10:47:00', 6, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (15, 10, -1, 9, '2024-09-27 11:53:00', 7, 'FILLPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (17, 19, 6, 6, '2024-10-01 09:32:00', 8, 'ADD');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (17, 9, -2, 4, '2024-09-30 14:40:00', 9, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (17, 13, -1, 3, '2024-09-03 12:25:00', 10, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (14, 15, -1, 4, '2024-09-27 17:14:00', 11, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (17, 16, -1, 2, '2024-10-01 09:57:00', 12, 'SELLNONPRESC');
INSERT INTO inventory_updates(medication_id, user_activity_id, quantity_changed_by, resulting_total_quantity, timestamp, transaction_id, activity_type) VALUES (17, 17, -1, 1, '2024-10-02 14:12:00', 13, 'FILLPRESC');