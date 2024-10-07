-- a script to insert some canned data to Transaction. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE transactions;

-- columns: id, first_name, last_name, date_of_birth, address, phone_number, email, insurance_name, insurance_group_num, insurance_member_id


INSERT INTO patients(1, 'John', 'Doe', '1985-04-12',	'123 Main St', '123-456-7890', 'john.doe@randommail.com', 'HealthCarePlus', 12345, 'MEM10001');
INSERT INTO patients(2, 'Jane', 'Smith', '1990-09-21',	'456 Oak St', '234-567-8901', 'jane.smith@randommail.com', 'MediShield', 69636969, '1236532');
INSERT INTO patients(3, 'Mike', 'Johnson', '1975-07-19',	'789 Pine St', '345-678-9012', 'mike.johnson@randommail.com', 'HealthCarePlus', 12345, 'MEM10003');
INSERT INTO patients(4, 'Emma', 'Williams', '2000-12-05',	'111 Birch St', '456-789-0123', 'emma.williams@randommail.com', 'MediShield', 8888675, '123412');
INSERT INTO patients(5, 'Sarah', 'Connor', '1978-05-10',	'22 Future Blvd', '555-555-5555', 'sarah.connor@randommail.com', 'OmniHealth', 54321, 'MEM10005');
INSERT INTO patients(6, 'David', 'Rogers', '1969-10-22',	'123 Elm St', '567-890-1234', 'david.rogers@randommail.com', 'HealthCarePlus', 23423423, '129192');
INSERT INTO patients(7, 'Lucy', 'Adams', '1998-08-13',	'321 Cedar Ave', '678-901-2345', 'lucy.adams@randommail.com', 'OmniHealth', 54321, '132121241');
INSERT INTO patients(8, 'Bruce', 'Wayne', '1972-02-19',	'654 Gotham Blvd', '789-012-3456', 'bruce.wayne@randommail.com', 'HealthCarePlus', 12345, '1243ACD1');
INSERT INTO patients(9, 'Diana', 'Prince', '1995-03-30',	'789 Amazonian St', '890-123-4567', 'diana.prince@randommail.com', 'MediShield', 67890, 'MEM10009');
INSERT INTO patients(10, 'Clark', 'Kent', '1979-12-15',	'1 Smallville Ln', '901-234-5678', 'clark.kent@randommail.com', 'OmniHealth', 54321, 'MEM10010');
INSERT INTO patients(11, 'Peter', 'Parker', '2001-05-25',	'123 Spider Ave', '111-222-3333', 'peter.parker@randommail.com', 'HealthCarePlus', 12345, '123123WWqwA3');
INSERT INTO patients(12, 'Tony', 'Stark', '1980-06-15',	'1 Stark Tower Dr', '444-555-6666', 'tony.stark@randommail.com', 'MediShield', 67890, 'MEM10012');
INSERT INTO patients(13, 'Natasha', 'Romanoff', '1985-11-22',	'789 Widow St', '101-010-1010', 'natasha.romanoff@randommail.com', 'OmniHealth', 54321, 'MEM10013');
INSERT INTO patients(14, 'Steve', 'Rogers', '1980-07-04',	'99 Shield Ave', '909-808-7070', 'steve.rogers@randommail.com', 'HealthCarePlus', 12345, 'MEM10014');
INSERT INTO patients(15, 'Wanda', 'Maximoff', '1992-02-14',	'987 Hex Ln', '808-707-6060', 'wanda.maximoff@randommail.com', 'MediShield', 67890, 'MEM10015');
INSERT INTO patients(16, 'Scott', 'Lang', '1985-04-06',	'321 Quantum Dr', '707-606-5050', 'scott.lang@randommail.com', 'OmniHealth', 54321, 'MEM10016');
INSERT INTO patients(17, 'Bruce', 'Banner', '1969-12-18',	'543 Gamma Rd', '606-505-4040', 'bruce.banner@randommail.com', 'HealthCarePlus', 12345, 'MEM10017');
INSERT INTO patients(18, 'Carol', 'Danvers', '1988-10-24',	'789 Photon Ln', '505-404-3030', 'carol.danvers@randommail.com', 'MediShield', 67890, 'MEM10018');
INSERT INTO patients(19, 'Stephen', 'Strange', '1979-11-17',	'789 Mystic St', '404-303-2020', 'stephen.strange@randommail.com', 'OmniHealth', 54321, 'MEM10019');
INSERT INTO patients(20, 'Peter', 'Quill', '1982-08-21',	'123 Star Rd', '303-202-1010', 'peter.quill@randommail.com', 'HealthCarePlus', 12345, 'MEM10020');
INSERT INTO patients(21, 'Gamora', 'Zen Whoberi',	'1985-06-23',	'987 Titan Rd', '202-101-9999', 'gamora.zen@randommail.com', 'MediShield', 67890, 'MEM10021');
INSERT INTO patients(22, 'Bucky', 'Barnes', '1917-03-10',	'99 Winter St', '808-999-8888', 'bucky.barnes@randommail.com', 'HealthCarePlus', 12345, 'MEM10022');
