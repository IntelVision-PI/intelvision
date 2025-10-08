-- Script para testes do banco de dados Intelvision

-- Popular dados

insert into empresa (cnpj, nome, email, senha, codigo_ativacao, telefone, razao_social) values
('123456789', 'Intelbras', 'intelbras@intelbras.com', '123456789','ATV123', '(11) 95289-8922','INTELBRAS S.A. INDUSTRIA DE TELECOMUNICACAO ELETRONICA BRASILEIRA');

insert into usuario (fkEmpresa,nome,email,senha) values 
(1,'Amanda Amaral', 'amanda@intelbras.com.br', '123456'),
(1,'Beto Bezerra', 'beto@intelbras.com.br', '123456'),
(1,'Carlos Costa', 'carlos@intelbras.com.br', '123456');

show tables;
desc endereco;
desc empresa;
desc usuario;

select * from usuario;
select * from empresa;
