export type SettingsRow = {
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

export type BuildsRow = {
	build: string;
	version: string;
	path: string;
};
