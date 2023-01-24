--Créer BDD apirest
-- Active: 1646293745855@@127.0.0.1@3306@db_api_rest

/* Just drop database if already exists or create it */
drop database if exists `apirest`;
create database `apirest`;
use `apirest`;

create table if not exists users(
    id int auto_increment primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    email varchar(255) not null,
    adresse varchar(255) not null,
    role_id int default 1
);

-- Créer la table products
CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    image_path TEXT NOT NULL
    description TEXT NOT NULL,
    image VARCHAR(255) image IMAGE(4000000) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    PRIMARY KEY (id)
);

alter table users add constraint fk_users_roles foreign key (role_id) references roles(id);
alter table products add constraint fk_products_users foreign key (user_id) references users(id);
