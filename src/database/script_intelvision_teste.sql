-- Script para testes do banco de dados Intelvision

-- Popular dados

insert into empresa (cnpj, nome, email, senha, codigo_ativacao, telefone, razao_social) values
('123456789', 'Intelbras', 'intelbras@intelbras.com', '123456789','ATV123', '(11) 95289-8922','INTELBRAS S.A. INDUSTRIA DE TELECOMUNICACAO ELETRONICA BRASILEIRA');

insert into usuario (fkEmpresa,nome,email,senha) values 
(1,'Amanda Amaral', 'amanda@intelbras.com.br', '123456'),
(1,'Beto Bezerra', 'beto@intelbras.com.br', '123456'),
(1,'Carlos Costa', 'carlos@intelbras.com.br', '123456');

insert into servidor (fkEmpresa,nome,sistema_operacional,macaddress,tipo) values 
(1,'SRV001', 'ubuntu', '12:45:AF:12:98:AB',"Armazenamento"),
(1,'SRV002', 'windows server', '12:46:AF:12:98:AB',"Processamento"),
(1,'SRV003', 'ubuntu', '12:47:AF:12:98:AB',"Web");

insert into componente (nome,unidade_medida) values
("CPU","GHz"),
("RAM","GB"),
("HD","GB");

insert into parametro (fkServidor, fkComponente, alerta_min, alerta_max) values 
(1,1,20.0,95.0),
(1,2,40.0,75.0),
(1,3,0.0,75.0),
(2,1,34.0,85.0),
(2,2,23.0,90.0),
(2,3,20.0,67.0),
(3,1,10.0,65.0),
(3,2,33.0,55.0),
(3,3,15.0,32.0);



show tables;
desc empresa;
desc usuario;
desc servidor;
desc componente;
desc parametro;

select * from usuario;
select * from empresa;
select * from servidor;
select * from componente;
select * from parametro;
