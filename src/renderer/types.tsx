export type SettingsRow = {
	menuOpen: boolean;
	hostname: string;
	instanceLocation: string;
	buildLocation: string;
	extractMsi: boolean;
	lessmsiPath: string;
};

export type InstanceRow = {
	name: string;
	path: string;
	version: string;
	installPath: string;
	dbName: string;
	dbSize: number;
	dbLogSize: number;
	dbTotalSize: number;
};

export type BuildRow = {
	build: string;
	version: string;
	path: string;
};
