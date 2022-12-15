CREATE TABLE IF NOT EXISTS availableBuilds (
    version TEXT NOT NULL PRIMARY KEY,
    build TEXT NOT NULL, 
    path TEXT NOT NULL
);