-- Script para testes do banco de dados Intelvision

-- Popular dados

insert into empresa (cnpj, nome, email, senha, codigo_ativacao, telefone, razao_social) values
('123456789', 'Intelbras', 'intelbras@intelbras.com', '123456789','ATV123', '(11) 95289-8922','INTELBRAS S.A. INDUSTRIA DE TELECOMUNICACAO ELETRONICA BRASILEIRA'),
('987654321', 'Verisure', 'verisure@verisure.com', '123456789','ATV456', '(11) 98765-4321','VERISURE S.A. INDUSTRIA DE MONITORAMENTO AMERICANA'),
('123456789', 'TIVIT', 'tivit@tivit.com', '123456789','ATV789', '(11) 91234-5678','TIVIT S.A. SOLUÇÕES EM NUVEM');

insert into usuario (fkEmpresa,nome,email,senha,perfil,atividade) values 
(1,'Amanda Amaral', 'amanda@intelbras.com.br', '123456','empresaAdmin',1),
(1,'Beto Bezerra', 'beto@intelbras.com.br', '123456','empresaComum',1),
(1,'Carlos Costa', 'carlos@intelbras.com.br', '123456','empresaComum',0),
(2,'Dante Décio', 'dante@verisure.com.br', '123456','empresaAdmin',1),
(2,'Ezio Esmeralda', 'ezio@verisure.com.br', '123456','empresaComum',1),
(2,'Fernanda Fagundes', 'fernanda@verisure.com.br', '123456','empresaComum',0),
(3,'Gabriel Giovanni', 'Gabriel@tivit.com.br', '123456','empresaAdmin',1),
(3,'Heloísa Hellen', 'heloisa@tivit.com.br', '123456','empresaComum',1),
(3,'Isadora Ibisco', 'isadora@tivit.com.br', '123456','empresaComum',0);

insert into servidor (fkEmpresa,nome,sistema_operacional,macaddress,tipo) values 
(1,'SRV001', 'ubuntu', '12:45:AF:12:98:AB',"Armazenamento"),
(1,'SRV002', 'windows server', '12:46:AF:12:98:AB',"Processamento"),
(1,'SRV003', 'ubuntu', '12:47:AF:12:98:AB',"Web"),
(2,'SRV001', 'ubuntu', '12:48:AF:12:98:AB',"Armazenamento"),
(2,'SRV002', 'windows server', '12:49:AF:12:98:AB',"Processamento"),
(2,'SRV003', 'ubuntu', '12:50:AF:12:98:AB',"Web"),
(3,'SRV001', 'ubuntu', '12:51:AF:12:98:AB',"Armazenamento"),
(3,'SRV002', 'windows server', '12:52:AF:12:98:AB',"Processamento"),
(3,'SRV003', 'ubuntu', '12:53:AF:12:98:AB',"Web");

insert into servidor  (fkEmpresa,nome,sistema_operacional,macaddress,tipo) values
(1, 'servidor12.GABSERVIREDES', 'ubuntu', '00:1A:2B:3C:4D:12', 'Web'),
(2, 'servidor5.GUIEWVLXC', 'windows server', '00:1A:2B:3C:4D:05', 'Armazenamento'),
(3, 'servidor19.LETSS05HWDF', 'ubuntu', '00:1A:2B:3C:4D:19', 'Processamento'),
(1, 'servidor42.LUCHT33RSTA', 'windows server', '00:1A:2B:3C:4D:42', 'Web'),
(2, 'servidor6.NICOLASF8SK4U2', 'ubuntu', '00:1A:2B:3C:4D:06', 'Armazenamento'),
(3, 'servidor77.VINICIUSTJAS12', 'windows server', '00:1A:2B:3C:4D:77', 'Processamento');

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
(3,2,33.0,87.0),
(3,3,15.0,59.0),
(4,1,18.0,65.0),
(4,2,44.0,95.0),
(4,3,16.0,85.0),
(5,1,36.0,85.0),
(5,2,28.0,90.0),
(5,3,14.0,67.0),
(6,1,47.0,88.0),
(6,2,34.0,81.0),
(6,3,19.0,89.0),
(7,1,16.0,95.0),
(7,2,20.0,75.0),
(7,3,18.0,75.0),
(8,1,33.0,85.0),
(8,2,21.0,90.0),
(8,3,28.0,87.0),
(9,1,15.0,77.0),
(9,2,35.0,65.0),
(9,3,25.0,88.0);



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
