-- Script criação de usuário

CREATE USER 'intelvision-select' IDENTIFIED BY 'senha12@';

GRANT ALL ON intelvision.* TO 'intelvision-select' WITH GRANT OPTION;

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'intelvision-select';

