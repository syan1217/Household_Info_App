CREATE DATABASE IF NOT EXISTS cs6400_sp23_team037;

USE cs6400_sp23_team037;

DROP TABLE IF EXISTS `Generator`;
DROP TABLE IF EXISTS `WaterHeater`;
DROP TABLE IF EXISTS `HeatPump`;
DROP TABLE IF EXISTS `Heater`;
DROP TABLE IF EXISTS `AirConditioner`;
DROP TABLE IF EXISTS `Appliance`;
DROP TABLE IF EXISTS `Manufacturer`;
DROP TABLE IF EXISTS `HouseholdUtility`;
DROP TABLE IF EXISTS `Household`;
DROP TABLE IF EXISTS `Address`;



-- Tables

CREATE TABLE Address(
    postal_code varchar(255) NOT NULL ,
    city varchar(255) NOT NULL ,
    state varchar(255) NOT NULL ,
    latitude double NOT NULL ,
    longitude double NOT NULL ,
    PRIMARY KEY (postal_code)
);

CREATE TABLE Household(
    email varchar(255) NOT NULL ,
    postal_code varchar(255) NOT NULL ,
    square_footage int NOT NULL ,
    household_type varchar(255) NOT NULL ,
    heating double DEFAULT NULL,
    cooling double DEFAULT NULL,
    PRIMARY KEY (email),
    FOREIGN KEY (postal_code) REFERENCES Address (postal_code)
);

CREATE TABLE HouseholdUtility(
    email varchar(255) NOT NULL ,
    utilities varchar(255) DEFAULT NULL,
    UNIQUE (email,utilities),
    FOREIGN KEY (email) REFERENCES Household (email)
);

CREATE TABLE Manufacturer(
    manufacturer_id int unsigned NOT NULL AUTO_INCREMENT,
    manufacturer_name varchar(255) NOT NULL,
    PRIMARY KEY (manufacturer_id)
);

CREATE TABLE Appliance(
    email varchar(255) NOT NULL ,
    appliance_order int NOT NULL ,
    manufacturer_id int unsigned NOT NULL ,
    model_name varchar(255) DEFAULT NULL,
    btu_rating int NOT NULL,
    PRIMARY KEY (email, appliance_order),
    FOREIGN KEY (email) REFERENCES Household(email),
    FOREIGN KEY (manufacturer_id) REFERENCES Manufacturer(manufacturer_id)
);

CREATE TABLE WaterHeater(
    email varchar(255) NOT NULL ,
    appliance_order int NOT NULL ,
    capacity double NOT NULL ,
    temperature_setting int DEFAULT NULL,
    energy_source_wh varchar(255) NOT NULL,
    PRIMARY KEY (email, appliance_order),
    FOREIGN KEY (email, appliance_order) REFERENCES Appliance(email,appliance_order)
);

CREATE TABLE AirConditioner(
    email varchar(255) NOT NULL ,
    appliance_order int NOT NULL ,
    eer double NOT NULL ,
    PRIMARY KEY (email, appliance_order),
    FOREIGN KEY (email, appliance_order) REFERENCES Appliance(email,appliance_order)
);

CREATE TABLE Heater(
    email varchar(255) NOT NULL ,
    appliance_order int NOT NULL ,
    energy_source_h varchar(255) NOT NULL ,
    PRIMARY KEY (email, appliance_order),
    FOREIGN KEY (email, appliance_order) REFERENCES Appliance(email,appliance_order)
);

CREATE TABLE HeatPump(
    email varchar(255) NOT NULL ,
    appliance_order int NOT NULL ,
    hspf double NOT NULL ,
    seer double NOT NULL ,
    PRIMARY KEY (email, appliance_order),
    FOREIGN KEY (email, appliance_order) REFERENCES Appliance(email,appliance_order)
);

CREATE TABLE Generator(
    email varchar(255) NOT NULL ,
    generator_order int NOT NULL ,
    generation_type varchar(255) NOT NULL ,
    battery_storage_capacity int DEFAULT NULL ,
    average_monthly_kilowatt_hours int NOT NULL ,
    PRIMARY KEY (email, generator_order),
    FOREIGN KEY (email) REFERENCES Household(email)
);