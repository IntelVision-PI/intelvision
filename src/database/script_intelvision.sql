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
    fkEmpresa int not null,
    foreign key (fkEmpresa) references empresa(id)
);
