create table if NOT EXISTS  nilai (
id int auto_increment primary key,
siswa_id int not null,
kelas_id int not null,
mapel_id int not null,
nilai decimal(3,2) not null
);