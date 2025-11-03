
insert into empresa (cnpj, nome, email, senha, codigo_ativacao, telefone, razao_social) values
('123456789', 'Intelbras', 'intelbras@intelbras.com', '123456789','ATV123', '(11) 95289-8922','INTELBRAS S.A. INDUSTRIA DE TELECOMUNICACAO ELETRONICA BRASILEIRA'),
('987654321', 'Verisure', 'verisure@verisure.com', '123456789','ATV456', '(11) 98765-4321','VERISURE S.A. INDUSTRIA DE MONITORAMENTO AMERICANA'),
('123456789', 'TIVIT', 'tivit@tivit.com', '123456789','ATV789', '(11) 91234-5678','TIVIT S.A. SOLUÇÕES EM NUVEM');

-- usuario
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

-- servidor
insert into servidor  (fkEmpresa,nome,sistema_operacional,macaddress,tipo) values
(1, 'servidor12.GABSERVIREDES', 'ubuntu', '00:1A:2B:3C:4D:12', 'Web'),
(2, 'servidor5.GUIEWVLXC', 'windows server', '00:1A:2B:3C:4D:05', 'Armazenamento'),
(3, 'servidor19.LETSS05HWDF', 'ubuntu', '00:1A:2B:3C:4D:19', 'Processamento'),
(1, 'servidor42.LUCHT33RSTA', 'windows server', '00:1A:2B:3C:4D:42', 'Web'),
(2, 'servidor6.NICOLASF8SK4U2', 'ubuntu', '00:1A:2B:3C:4D:06', 'Armazenamento'),
(3, 'servidor77.VINICIUSTJAS12', 'windows server', '00:1A:2B:3C:4D:77', 'Processamento'),
(1, 'servidor13.DDFISA23', 'ubuntu', '00:1A:2B:3C:4D:12', 'Processamento'),
(1, 'servidor14.JASUDJC', 'ubuntu', '00:1A:2B:3C:4D:13', 'Armazenamento'),
(1, 'servidor15.SJRF6DS', 'ubuntu', '00:1A:2B:3C:4D:14', 'Armazenamento'),
(1, 'servidor16.FFGWC09', 'ubuntu', '00:1A:2B:3C:4D:15', 'Armazenamento'),
(1, 'servidor17.SDCSD56', 'ubuntu', '00:1A:2B:3C:4D:16', 'Processamento'),
(1, 'servidor18.SDCVDE67', 'ubuntu', '00:1A:2B:3C:4D:17', 'Processamento'),
(1, 'servidor19.SADCX66', 'ubuntu', '00:1A:2B:3C:4D:18', 'Processamento'),
(1, 'servidor20.ASWE776', 'ubuntu', '00:1A:2B:3C:4D:19', 'Web');
;

-- componente
insert into componente (nome,unidade_medida) values
('CPU','GHz'),
('RAM','GB'),
('HD','GB');

-- parametro

insert into parametro (fkServidor, fkComponente, em_risco_min, em_risco_max, alerta) values 
(1,1,20.0,95.0, 80),
(1,2,40.0,75.0, 80),
(1,3,0.0,75.0, 80),
(2,1,34.0,85.0, 80),
(2,2,23.0,90.0, 80),
(2,3,20.0,67.0, 80),
(3,1,10.0,65.0, 80),
(3,2,33.0,87.0, 80),
(3,3,15.0,59.0, 80),
(4,1,18.0,65.0, 80),
(4,2,44.0,95.0, 80),
(4,3,16.0,85.0, 80),
(5,1,36.0,85.0, 80),
(5,2,28.0,90.0, 80),
(5,3,14.0,67.0, 80),
(6,1,47.0,88.0, 80),
(6,2,34.0,81.0, 80),
(6,3,19.0,89.0, 80);
