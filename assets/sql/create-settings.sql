CREATE TABLE IF NOT EXISTS settings (
    hostname TEXT NOT NULL PRIMARY KEY,
    instanceLocation TEXT, 
    buildLocation TEXT, 
    extractMsi BIT DEFAULT 0 NOT NULL, 
    lessmsiPath TEXT
);