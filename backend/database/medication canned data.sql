-- To delete all the rows out of the table
-- TRUNCATE TABLE medications;

-- Inserting canned data into the medications table with dosage as integers (unit removed)
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(1, 'Ibuprofen', 200, 500, FALSE, '2025-05-10', 0.1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(2, 'Amoxicillin', 500, 200, TRUE, '2024-12-01', 2);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(3, 'Lipitor', 20, 300, TRUE, '2026-03-15', 0.75);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(4, 'Acetaminophen', 500, 1000, FALSE, '2025-11-30', 0.08);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(5, 'Aspirin', 100, 500, FALSE, '2024-07-22', 0.05);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(6, 'Warfarin', 2.5, 150, TRUE, '2024-10-10', 1.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(7, 'Metformin', 850, 400, TRUE, '2025-02-14', 0.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(8, 'Melatonin', 2, 5, FALSE, '2024-10-31', 0.0004);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(9, 'Dramamine', 1000, 1200, FALSE, '2021-10-01', 0.51);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(10, 'Ibuprofen', 200, 500, FALSE, '2025-05-10', 0.1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(11, 'Amoxicillin', 500, 100, TRUE, '2024-12-01', 2);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(12, 'Lipitor', 20, 300, TRUE, '2026-03-15', 0.75);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(13, 'Acetaminophen', 500, 1000, FALSE, '2025-11-30', 0.08);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(14, 'Aspirin', 100, 200, FALSE, '2024-07-22', 0.05);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(15, 'Hydrochlorothiazide', 12.5, 600, TRUE, '2026-02-18', 0.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(16, 'Simvastatin', 40, 1, TRUE, '2025-09-20', 1.1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(17, 'Metformin', 1000, 400, TRUE, '2026-05-23', 0.25);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(18, 'Prednisone', 10, 500, TRUE, '2024-10-05', 1.5);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(19, 'Warfarin', 5, 100, TRUE, '2025-04-20', 0.8);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(20, 'Losartan', 50, 200, TRUE, '2024-11-11', 1);
INSERT INTO medications(id, name, dosage, quantity, prescription_required, expiration_date, dollars_per_unit) 
VALUES(21, 'Levothyroxine', 75, 300, TRUE, '2026-01-01', 0.55);
