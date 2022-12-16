CREATE TABLE IF NOT EXISTS availableBuilds (
    build TEXT NOT NULL PRIMARY KEY,
    version TEXT NOT NULL, 
    path TEXT NOT NULL
);