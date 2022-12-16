CREATE TABLE IF NOT EXISTS settings (
    menuOpen BIT DEFAULT 1 NOT NULL, 
    hostname TEXT,
    instanceLocation TEXT, 
    buildLocation TEXT, 
    extractMsi BIT DEFAULT 0 NOT NULL, 
    lessmsiPath TEXT, 
    windowWidth BIT DEFAULT 1600 NOT NULL, 
    windowheight BIT DEFAULT 900 NOT NULL
);