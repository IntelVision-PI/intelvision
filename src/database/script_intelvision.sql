-- drop database intelvision;
create database intelvision;
use intelvision;
create table endereco(
	id int not null primary key auto_increment,
    cep char(9) not null,
    numero int not null,
    complemento varchar(100)
);

create table empresa(
	id int not null primary key auto_increment,
    cnpj char(9) not null,
    nome varchar(50) not null,
    email varchar(200) not null,
    senha varchar(100) not null,
    codigo_ativacao varchar(45) not null,
    telefone varchar(20),
    razao_social varchar(100),
    fkEndereco int not null,
    foreign key (fkEndereco) references endereco(id)
);

create table usuario(
	id int not null primary key auto_increment,
    nome varchar(200) not null,
    email varchar(200),
    senha varchar(20),
    fkEmpresa int not null,
    foreign key (fkEmpresa) references empresa(id)
);

show tables;
desc endereco;
desc empresa;
desc usuario;

insert into endereco (cep, numero, complemento) 
values 
('12345-678', 100, null);
insert into empresa (cnpj, nome, email, senha, codigo_ativacao, telefone, razao_social, fkEndereco) 
values
('123456789', 'Intelbras', 'intelbras@intelbras.com', '123456789','ATV123', '(11) 95289-8922','INTELBRAS S.A. INDUSTRIA DE TELECOMUNICACAO ELETRONICA BRASILEIRA', 1);


select * from usuario;
select id from empresa where codigo_ativacao='ATV123';