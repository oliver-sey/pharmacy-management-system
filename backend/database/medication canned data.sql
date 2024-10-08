-- a script to insert some canned data to Medication. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE medications;
-- columns: id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit

INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(1, 'Ibuprofen', '200mg', 500, FALSE, '2025-05-10', 0.1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(2, 'Amoxicillin', '500mg', 200, TRUE, '2024-12-01', 2);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(3, 'Lipitor', '20mg', 300, TRUE, '2026-03-15', 0.75);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(4, 'Acetaminophen', '500mg', 1000, FALSE, '2025-11-30', 0.08);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(5, 'Aspirin', '100mg', 500, FALSE, '2024-07-22', 0.05);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(6, 'Warfarin', '2.5mg', 150, TRUE, '2024-10-10', 1.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(7, 'Metformin', '850mg', 400, TRUE, '2025-02-14', 0.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(8, 'Melatonin', '2mg', 5, FALSE, '2024-10-31', 0.0004);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(9, 'Dramamine', '1000mg', 1200, FALSE, '2021-10-01', 0.51);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(10, 'Ibuprofen', '200mg', 500, FALSE, '2025-05-10', 0.1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(11, 'Amoxicillin', '500mg', 100, TRUE, '2024-12-01', 2);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(12, 'Lipitor', '20mg', 300, TRUE, '2026-03-15', 0.75);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(13, 'Acetaminophen', '500mg', 1000, FALSE, '2025-11-30', 0.08);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(14, 'Aspirin', '100mg', 200, FALSE, '2024-07-22', 0.05);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(15, 'Hydrochlorothiazide', '12.5mg', 600, TRUE, '2026-2-18', 0.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(16, 'Simvastatin', '40mg', 1, TRUE, '2025-9-20', 1.1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(17, 'Metformin', '1000mg', 400, TRUE, '2026-5-23', 0.25);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(18, 'Prednisone', '10mg', 500, TRUE, '2024-10-5', 1.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(19, 'Warfarin', '5mg', 100, TRUE, '2025-4-20', 0.8);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(20, 'Losartan', '50mg', 200, TRUE, '2024-11-11', 1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) VALUES(21, 'Levothyroxine', '75mcg', 300, TRUE, '2026-1-1', 0.55);
