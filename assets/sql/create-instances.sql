CREATE TABLE IF NOT EXISTS instances (
    name TEXT NOT NULL PRIMARY KEY,
    path TEXT, 
    installPath TEXT, 
    version TEXT, 
    dbName TEXT, 
    dbSize DECIMAL(12,4), 
    dbLogSize DECIMAL(12,4), 
    dbTotalSize DECIMAL(12,4)
);