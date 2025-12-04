use intelvision;

insert into empresa (cnpj, nome, email, senha, codigo_ativacao, telefone, razao_social) values
('123456789', 'Intelbras', 'intelbras@intelbras.com', '123456789','ATV123', '(11) 95289-8922','INTELBRAS S.A. INDUSTRIA DE TELECOMUNICACAO ELETRONICA BRASILEIRA');

-- usuario
insert into usuario (fkEmpresa,nome,email,senha,perfil,atividade) values 
(1,'Amanda Amaral', 'amanda@intelbras.com.br', '123456','empresaAdmin',1),
(1,'Beto Bezerra', 'beto@intelbras.com.br', '123456','empresaComum',1),
(1,'Carlos Costa', 'carlos@intelbras.com.br', '123456','empresaComum',1);
-- servidor
insert into servidor  (fkEmpresa,nome,sistema_operacional,macaddress,tipo,modelo,service_tag,atividade) values
(1, 'servidor77.VINICIUSTJAS12', 'ubuntu', '00:1A:2B:3C:4D:91', 'Processamento',"ASSRV898", "895AQQ", 1),
(1, 'servidor13.DDFISA23', 'ubuntu', '00:1A:2B:3C:4D:12', 'Processamento',"PowerEdge777", "129TBC", 1),
(1, 'servidor86.SADCX66', 'ubuntu', '00:1A:3B:3C:4B:18', 'Processamento',"HPSRV879", "493SDA", 1),
(1, 'servidor15.SJRF6DS', 'ubuntu', '00:1A:2B:3C:4D:14', 'Processamento',"HPSRV788", "961ABC", 1),
(1, 'servidor19.LETSS05HWDF', 'ubuntu', '00:1A:2B:3C:4D:18', 'Processamento',"HPSRV878", "123ASF", 1),
(1, 'servidor6.NICOLASF8SK4U2', 'ubuntu', '00:1A:2B:3C:4D:06', 'Web',"PowerEdge753", "123SBC", 1),
(1, 'servidor5.GUIEWVLXC', 'ubuntu', '00:1A:2B:3C:4D:15', 'Armazenamento',"HPSRV898", "123AYU", 1),
(1, 'servidor14.JASUDJC', 'ubuntu', '00:1A:2B:3C:4D:13', 'Armazenamento',"HPSRV888", "175ABC", 1)
;

-- componente
insert into componente (nome,unidade_medida) values
('CPU','GHz'),
('RAM','GB'),
('HD','GB'),
('CODEC','MPEG-2'),
('CODEC','H-264'),
('CODEC','H-265'),
('CODEC','WMV'),
('CODEC','XVID');

-- parametro

insert into parametro (fkServidor, fkComponente, em_risco_min, em_risco_max, alerta) values 
(1,1,10.0,95.0, 80),
(1,2,10.0,75.0, 65),
(1,3,5.0,75.0, 70),
(1,5,0.0,80.0, 75),
(2,1,10.0,95.0, 80),
(2,2,10.0,75.0, 65),
(2,3,5.0,75.0, 70),
(2,6,0.0,90.0, 85),
(3,1,10.0,95.0, 80),
(3,2,10.0,75.0, 65),
(3,3,5.0,75.0, 70),
(3,5,0.0,80.0, 75),
(4,1,10.0,95.0, 80),
(4,2,10.0,75.0, 65),
(4,3,5.0,75.0, 70),
(4,4,0.0,80.0, 75),
(5,1,10.0,95.0, 80),
(5,2,10.0,75.0, 65),
(5,3,5.0,75.0, 70),
(5,8,0.0,72.0, 65),
(6,1,12.0,85.0, 70),
(6,2,12.0,85.0, 75),
(6,3,15.0,90.0, 85),
(7,1,12.0,85.0, 70),
(7,2,12.0,85.0, 75),
(7,3,15.0,95.0, 90),
(8,1,15.0,90.0, 80),
(8,2,12.0,85.0, 75),
(8,3,10.0,85.0, 75)
;
