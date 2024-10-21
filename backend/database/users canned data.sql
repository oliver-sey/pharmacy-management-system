-- a script to insert some canned data to User. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE users;

INSERT INTO users (id, first_name, last_name, user_type, email, password, is_locked_out) VALUES (1, 'pharmacist', 'alice.pharm@example.com', 'passAlice1', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (2, 'pharmacymanager', 'oliver@cool.com', 'cool123', TRUE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (3, 'pharmacytech', 'carol.tech@example.com', 'passCarol3', TRUE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (4, 'cashier', 'dave.cashier@example.com', 'passDave4', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (5, 'pharmacist', 'eve.pharm@example.com', 'passEve5', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (6, 'pharmacytech', 'frank.tech@example.com', 'passFrank6', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (7, 'cashier', 'gina.cashier@example.com', 'password1', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (8, 'pharmacymanager', 'hank.manager@example.com', 'passHank8', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (9, 'pharmacytech', 'isabel.tech@example.com', 'passIsabel9', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (10, 'pharmacist', 'james.pharm@example.com', 'passJames10', TRUE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (11, 'cashier', 'kelly.cashier@example.com', 'passKelly11', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (12, 'pharmacymanager', 'leo.manager@example.com', 'passLeo12', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (13, 'pharmacytech', 'mary.tech@example.com', 'passMary13', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (14, 'pharmacist', 'nora.pharm@example.com', 'passNora14', TRUE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (15, 'cashier', 'oscar.cashier@example.com', 'passOscar15', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (16, 'pharmacytech', 'paul.tech@example.com', 'passPaul16', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (17, 'pharmacist', 'quinn.pharm@example.com', 'passQuinn17', TRUE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (18, 'cashier', 'rachel.cashier@example.com', 'passRachel18', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (19, 'pharmacymanager', 'steve.manager@example.com', 'passSteve19', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (20, 'pharmacytech', 'tony.tech@example.com', 'passTony20', TRUE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (21, 'pharmacist', 'ursula.pharm@example.com', 'passUrsula21', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (22, 'cashier', 'victor.cashier@example.com', 'passVictor22', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (23, 'pharmacytech', 'wanda.tech@example.com', 'passWanda23', FALSE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (24, 'pharmacist', 'xander.pharm@example.com', 'passXander24', TRUE);
INSERT INTO users (id, user_type, email, password, is_locked_out) VALUES (25, 'pharmacymanager', 'yvette.manager@example.com', 'passYvette25', FALSE);
