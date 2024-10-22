-- a script to insert some canned data to User. This connects with (and should make sense with) all the other tables of canned data
-- run these in PGAdmin to insert some canned data

-- to delete all the rows out of the table
-- TRUNCATE TABLE users;

-- users table
-- *******NOTE: all passwords are 'password'
    
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Alice', 'Stevenson', 'pharmacist', 'alice.pharm@example.com', '"$2b$12$XKDWZkY0V0My9d/EBIawCOqRE283Jzt8d6m5Jc.kUdVhW8ZouhNfG"', FALSE); -- id #1
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Oliver', 'Seemorebutts', 'pharmacymanager', 'oliver@cool.com', '$2b$12$Uc9QHInwXBCdOzp4KxscK.63TuCusz2Ax7RariEJhi1LOv53wR.0e', FALSE); -- id #2
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Carol', 'Davies', 'pharmacytech', 'carol.tech@example.com', '$2b$12$tT7e.YEtU6eoxCYH3LUGqO.0kLWehKA80D/hMEtH/lv3zZvO4m.Qy', FALSE); -- id #3
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Dave', 'Frank', 'cashier', 'dave.cashier@example.com', '$2b$12$wjGUxF0.1fMW6KI3CAk9k.HHqs0rLTMnnLSAAChEfFdG5HzthAeAa', FALSE); -- id #4
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Eve', 'Barrancato', 'pharmacist', 'eve.pharm@example.com', '$2b$12$XvdHJgssaYJeiFYqAUxrUeYdJxouAUwmLrWv2G8OWn1AUeuUhvILW', FALSE); -- id #5
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Frank', 'Wright', 'pharmacytech', 'frank.tech@example.com', '$2b$12$7CjTRY.PQgUKvNMdq5vro.WncpDTfJ20rv5mog14ZZS92gpJkPGna', FALSE); -- id #6
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Gina', 'Cler', 'cashier', 'gina.cashier@example.com', '$2b$12$3KOSxmCBEj7fdL/TOhTVCeoiii1BrEvnPakKudbN5Zw5ft3QYbZCK', FALSE); -- id #7
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Hank', 'Oldman', 'pharmacymanager', 'hank.manager@example.com', '$2b$12$.YR6KLtrv9ixoyrT6ZYHWOoO./Z2nofz6FslK37YHQwTjWhdYxwA.', FALSE); -- id #8
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Isabel', 'Raudies', 'pharmacytech', 'isabel.tech@example.com', '$2b$12$Og054nBFVNBk1Z/.DCFXbuVoVqXsSMH73drcCJSCo92pNV4pOa2Ua', FALSE); -- id #9
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('James', 'Delp', 'pharmacist', 'james.pharm@example.com', '$2b$12$QWeyx9Xd4LUaZfBSO2gzb.m4WRtxqByVmoTa7FETf3VsCHadOdLlu', FALSE); -- id #10
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Kelly', 'Clarkson', 'cashier', 'kelly.cashier@example.com', '$2b$12$SOYO9rO.C11Vi/YjLZO0BeXKREjzlQtgOT8nz6QLLc8m6hmP8M3U6', FALSE); -- id #11
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Leo', 'Girolami', 'pharmacymanager', 'leo.manager@example.com', '$2b$12$xSoMrbLG.Jmph0gZffwlx.VDgu3BaTg55b3tDUrP4fuK5Pl21PPi.', FALSE); -- id #12
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Mary', 'Olsen', 'pharmacytech', 'mary.tech@example.com', '$2b$12$o0QFdyhJ3APZ.n86Qnz0yeFLM8gC0iFnuj5UCoktEROhwT1Kj/.jW', FALSE); -- id #13
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Nora', 'Newman', 'pharmacist', 'nora.pharm@example.com', '$2b$12$OqhWdhVXGMFsJGwrrzlnhefrC7tvkBavYaTLVTihOmfTIdUA9nVTm', FALSE); -- id #14
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Oscar', 'Piastri', 'cashier', 'oscar.cashier@example.com', '$2b$12$3jjuQ46cDX9V.CrtVImCKObqlJtZTGChvfvVuIx41R1q/uUDBw.vO', FALSE); -- id #15
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Paul', 'Downs', 'pharmacytech', 'paul.tech@example.com', '$2b$12$Q8T7tbeI3pqoVAt8RBbP9.U4/QIZyHYwhV7ngBPO/F/QRv0FuaCvS', FALSE); -- id #16
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Quinn', 'Cooney', 'pharmacist', 'quinn.pharm@example.com', '$2b$12$Ka7Xrs2V6Pe8p26Z2w/72u135/EDZ/kkdGx6AjPfCAMo5nZ3AMJPu', TRUE); -- id #17
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Rachel', 'Davidson', 'cashier', 'rachel.cashier@example.com', '$2b$12$C9BgHch0jB08.S.Fi56A9uJvQcjl.QGeCsClcEfE9S2JorfB99bTS', FALSE); -- id #18
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Steve', 'Madden', 'pharmacymanager', 'steve.manager@example.com', '$2b$12$ObhfnA0QrGimKzb8EJ6G8OMUDj0JeeZxUZU7LdebIoEreTc7arOh6', FALSE); -- id #19
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Tony', 'Hawk', 'pharmacytech', 'tony.tech@example.com', '$2b$12$GM0mN.jf3aI2oEFsP7EMYOQLHugNoucUJvFzimIcW8Y/pShUviG4W', TRUE); -- id #20
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Ursula', 'Van Schothorst', 'pharmacist', 'ursula.pharm@example.com', '$2b$12$gYMWcFOnIBwMxQjNkWblF.wUel9fnB6gBzVXulLnD4jNLLP1OP7ca', FALSE); -- id #21
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Victor', 'Franks', 'cashier', 'victor.cashier@example.com', '$2b$12$CGWK9XeQAr5HneYf4nIf0evXaNBJ058oGOfB45.rEke//g8ruKSUi', FALSE); -- id #22
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Wanda', 'Notlost', 'pharmacytech', 'wanda.tech@example.com', '$2b$12$xnrmNLHgSjjfECF5IueZEO8LatXlwiBEqeFSKdnXAnsJepODU9ckC', FALSE); -- id #23
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Xander', 'Didrickson', 'pharmacist', 'xander.pharm@example.com', '$2b$12$TcQ10ZsnubBJuJPp/bZU0ON/sqwQHkRbbxC09hcCFJj.rWCVC/YfO', TRUE); -- id #24
INSERT INTO users (first_name, last_name, user_type, email, password, is_locked_out) VALUES ('Yvette', 'Cooms', 'pharmacymanager', 'yvette.manager@example.com', '$2b$12$uC8NOm5OgKuzD6be9MMvX.Ik6FnvL81Fgq6Tgsha3e3zpul6F21lK', FALSE); -- id #25
