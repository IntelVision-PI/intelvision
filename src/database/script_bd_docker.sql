-- drop database intelvision;
create database intelvision;
use intelvision;

-- Script criação de usuário

CREATE USER 'intelvision-select' IDENTIFIED BY 'senha12@';

GRANT ALL ON intelvision.* TO 'intelvision-select' WITH GRANT OPTION;

FLUSH PRIVILEGES;

-- Script para criação do banco de dados Intelvision

create table empresa(
	id int not null primary key auto_increment,
    cnpj char(9) not null,
    nome varchar(50) not null,
    email varchar(200) not null,
    senha varchar(100) not null,
    codigo_ativacao varchar(45) not null,
    telefone varchar(20),
    razao_social varchar(100)
);

create table usuario(
	id int not null primary key auto_increment,
    nome varchar(200) not null,
    email varchar(200),
    senha varchar(20),
    perfil enum('empresaAdmin', 'empresaComum') not null,
    atividade tinyint not null,
    fkEmpresa int not null,
    foreign key (fkEmpresa) references empresa(id)
);

create table servidor(
	id int not null primary key auto_increment,
    nome varchar(45),
    sistema_operacional varchar(45),
    macaddress varchar(17),
    tipo varchar(45),
    modelo varchar(30),
    service_tag varchar(20),
    atividade tinyint,
    fkEmpresa int not null,
    foreign key (fkEmpresa) references empresa(id)
);

create table componente(
	id int not null primary key auto_increment,
    nome varchar(45), -- Ram, disco, rede e cpu
    unidade_medida varchar(45) -- GB, TB
);

create table parametro(
	id int not null primary key auto_increment,
    fkComponente int not null,
    fkServidor int not null,
    em_risco_min double, -- Alerta mínimo de perigo
    em_risco_max double, -- Alerta máximo de perigo
    alerta double,
    -- capacidade_total double, -- Capacidade total do componente (Exemplo: 100, que seria, por exemplo, 100 GB de RAM)
    foreign key (fkServidor) references servidor(id),
    foreign key (fkComponente) references componente(id)
);


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
insert into servidor  (fkEmpresa,nome,sistema_operacional,macaddress,tipo,modelo,service_tag,atividade) values
(1, 'servidor12.GABSERVIREDES', 'ubuntu', '00:1A:2B:3C:4D:12', 'Web',"PowerEdge123", "123ABC", 1),
(2, 'servidor5.GUIEWVLXC', 'windows server', '00:1A:2B:3C:4D:05', 'Armazenamento',"PowerEdge456", "123ABD", 1),
(3, 'servidor19.LETSS05HWDF', 'ubuntu', '00:1A:2B:3C:4D:19', 'Processamento',"PowerEdge789", "123ABF", 1),
(1, 'servidor42.LUCHT33RSTA', 'windows server', '00:1A:2B:3C:4D:42', 'Web',"PowerEdge123", "123ACC", 1),
(2, 'servidor6.NICOLASF8SK4U2', 'ubuntu', '00:1A:2B:3C:4D:06', 'Armazenamento',"PowerEdge753", "123SBC", 1),
(3, 'servidor77.VINICIUSTJAS12', 'windows server', '00:1A:2B:3C:4D:77', 'Processamento',"PowerEdge856", "153ABC", 1),
(1, 'servidor13.DDFISA23', 'ubuntu', '00:1A:2B:3C:4D:12', 'Processamento',"PowerEdge777", "129TBC", 1),
(1, 'servidor14.JASUDJC', 'ubuntu', '00:1A:2B:3C:4D:13', 'Armazenamento',"HPSRV888", "175ABC", 1),
(1, 'servidor15.SJRF6DS', 'ubuntu', '00:1A:2B:3C:4D:14', 'Armazenamento',"HPSRV888", "961ABC", 1),
(1, 'servidor16.FFGWC09', 'ubuntu', '00:1A:2B:3C:4D:15', 'Armazenamento',"HPSRV898", "123AYU", 1),
(1, 'servidor17.SDCSD56', 'ubuntu', '00:1A:2B:3C:4D:16', 'Processamento',"HPSRV718", "123GBC", 1),
(1, 'servidor18.SDCVDE67', 'ubuntu', '00:1A:2B:3C:4D:17', 'Processamento',"HPSRV688", "114ABC", 1),
(1, 'servidor19.SADCX66', 'ubuntu', '00:1A:2B:3C:4D:18', 'Processamento',"HPSRV878", "123ASF", 1),
(1, 'servidor20.ASWE776', 'ubuntu', '00:1A:2B:3C:4D:19', 'Web',"HPSRV888", "129YBC", 1);
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

