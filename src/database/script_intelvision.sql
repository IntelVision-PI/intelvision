-- drop database intelvision;
create database intelvision;
use intelvision;
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
    alerta_min double, -- Alerta mínimo de perigo
    alerta_max double, -- Alerta máximo de perigo
    -- capacidade_total double, -- Capacidade total do componente (Exemplo: 100, que seria, por exemplo, 100 GB de RAM)
    foreign key (fkServidor) references servidor(id),
    foreign key (fkComponente) references componente(id)
);