-- a script to insert some canned data to User. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE users;

INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (1, 'Alice', 'Stevenson', 'pharmacist', 'alice.pharm@example.com', 'passAlice1', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (2, 'Oliver', 'Seemorebutts', 'pharmacymanager', 'oliver@cool.com', 'cool123', TRUE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (3, 'Carol', 'Davies', 'pharmacytech', 'carol.tech@example.com', 'passCarol3', TRUE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (4, 'Dave', 'Frank', 'cashier', 'dave.cashier@example.com', 'passDave4', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (5, 'Eve', 'Barrancato', 'pharmacist', 'eve.pharm@example.com', 'passEve5', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (6, 'Frank', 'Wright', 'pharmacytech', 'frank.tech@example.com', 'passFrank6', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (7, 'Gina', 'Cler', 'cashier', 'gina.cashier@example.com', 'password1', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (8, 'Hank', 'Oldman', 'pharmacymanager', 'hank.manager@example.com', 'passHank8', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (9, 'Isabel', 'Raudies', 'pharmacytech', 'isabel.tech@example.com', 'passIsabel9', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (10, 'James', 'Delp', 'pharmacist', 'james.pharm@example.com', 'passJames10', TRUE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (11, 'Kelly', 'Clarkson', 'cashier', 'kelly.cashier@example.com', 'passKelly11', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (12, 'Leo', 'Girolami', 'pharmacymanager', 'leo.manager@example.com', 'passLeo12', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (13, 'Mary', 'Olsen', 'pharmacytech', 'mary.tech@example.com', 'passMary13', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (14, 'Nora', 'Newman', 'pharmacist', 'nora.pharm@example.com', 'passNora14', TRUE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (15, 'Oscar', 'Piastri', 'cashier', 'oscar.cashier@example.com', 'passOscar15', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (16, 'Paul', 'Downs', 'pharmacytech', 'paul.tech@example.com', 'passPaul16', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (17, 'Quinn', 'Cooney', 'pharmacist', 'quinn.pharm@example.com', 'passQuinn17', TRUE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (18, 'Rachel', 'Davidson', 'cashier', 'rachel.cashier@example.com', 'passRachel18', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (19, 'Steve', 'Madden', 'pharmacymanager', 'steve.manager@example.com', 'passSteve19', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (20, 'Tony', 'Hawk', 'pharmacytech', 'tony.tech@example.com', 'passTony20', TRUE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (21, 'Ursula', 'Van Schothorst', 'pharmacist', 'ursula.pharm@example.com', 'passUrsula21', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (22, 'Victor', 'Franks', 'cashier', 'victor.cashier@example.com', 'passVictor22', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (23, 'Wanda', 'Notlost', 'pharmacytech', 'wanda.tech@example.com', 'passWanda23', FALSE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (24, 'Xander', 'Didrickson', 'pharmacist', 'xander.pharm@example.com', 'passXander24', TRUE);
INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (25, 'Yvette', 'Cooms', 'pharmacymanager', 'yvette.manager@example.com', 'passYvette25', FALSE);
