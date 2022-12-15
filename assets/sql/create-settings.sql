CREATE TABLE IF NOT EXISTS settings (
    menuOpen BIT DEFAULT 1 NOT NULL, 
    hostname TEXT,
    instanceLocation TEXT, 
    buildLocation TEXT, 
    extractMsi BIT DEFAULT 0 NOT NULL, 
    lessmsiPath TEXT
);