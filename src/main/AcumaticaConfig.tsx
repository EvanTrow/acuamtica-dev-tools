export default interface AcumaticaConfig {
	_declaration: Declaration;
	configuration: Configuration;
}

export interface Declaration {
	_attributes: DeclarationAttributes;
}

export interface DeclarationAttributes {
	version: string;
	encoding: string;
	standalone: string;
}

export interface Configuration {
	configSections: ConfigSections;
	connectionStrings: ConnectionStrings;
	appSettings: AppSettings;
	'px.core': PxCore;
	location: Location[];
	'system.web': ConfigurationSystemWeb;
	'system.webServer': SystemWebServer;
	'system.serviceModel': SystemServiceModel;
	'system.codedom': SystemCodedom;
	runtime: Runtime;
}

export interface AppSettings {
	clear: Clear;
	add: AppSettingsAdd[];
}

export interface AppSettingsAdd {
	_attributes: PurpleAttributes;
}

export interface PurpleAttributes {
	key: string;
	value: string;
}

export interface Clear {}

export interface ConfigSections {
	sectionGroup: SectionGroup;
	section: SectionElement[];
}

export interface SectionElement {
	_attributes: SectionGroupAttributes;
}

export interface SectionGroupAttributes {
	name: string;
	type: string;
}

export interface SectionGroup {
	_attributes: SectionGroupAttributes;
	section: SectionGroupSection;
}

export interface SectionGroupSection {
	_attributes: FluffyAttributes;
}

export interface FluffyAttributes {
	name: string;
	type: string;
	allowDefinition: string;
}

export interface ConnectionStrings {
	remove: RemoveElement[];
	add: ConnectionStringsAdd[];
}

export interface ConnectionStringsAdd {
	_attributes: TentacledAttributes;
}

export interface TentacledAttributes {
	name: string;
	providerName: string;
	connectionString: string;
}

export interface RemoveElement {
	_attributes: StickyAttributes;
}

export interface StickyAttributes {
	name: string;
}

export interface Location {
	_attributes: LocationAttributes;
	'system.web': LocationSystemWeb;
	'system.identityModel'?: SystemIdentityModel;
	'system.identityModel.services'?: SystemIdentityModelServices;
}

export interface LocationAttributes {
	inheritInChildApplications?: string;
	path?: string;
}

export interface SystemIdentityModel {
	identityConfiguration: IdentityConfiguration;
}

export interface IdentityConfiguration {
	issuerNameRegistry: ClaimsAuthenticationManager;
	claimsAuthenticationManager: ClaimsAuthenticationManager;
	audienceUris: AudienceUris;
	securityTokenHandlers: SecurityTokenHandlers;
	certificateValidation: CertificateValidation;
}

export interface AudienceUris {
	add: AudienceUrisAdd;
}

export interface AudienceUrisAdd {
	_attributes: IndigoAttributes;
}

export interface IndigoAttributes {
	value: string;
}

export interface CertificateValidation {
	_attributes: CertificateValidationAttributes;
}

export interface CertificateValidationAttributes {
	certificateValidationMode: string;
}

export interface ClaimsAuthenticationManager {
	_attributes: ClaimsAuthenticationManagerAttributes;
}

export interface ClaimsAuthenticationManagerAttributes {
	type: string;
}

export interface SecurityTokenHandlers {
	add: ClaimsAuthenticationManager;
	remove: ClaimsAuthenticationManager;
}

export interface SystemIdentityModelServices {
	federationConfiguration: FederationConfiguration;
}

export interface FederationConfiguration {
	wsFederation: WsFederation;
}

export interface WsFederation {
	_attributes: WsFederationAttributes;
}

export interface WsFederationAttributes {
	passiveRedirectEnabled: string;
	issuer: string;
	realm: string;
	requireHttps: string;
	PersistentCookiesOnPassiveRedirects: string;
}

export interface LocationSystemWeb {
	machineKey?: MachineKey;
	securityPolicy?: SecurityPolicy;
	trust?: Trust;
	fullTrustAssemblies?: Clear;
	roleManager?: RoleManager;
	membership?: Membership;
	siteMap?: SiteMap;
	globalization?: Globalization;
	authentication?: Authentication;
	authorization: SystemWebAuthorization;
	trace?: Trace;
	sessionState?: SessionState;
	customErrors?: Authentication;
	webParts?: WebParts;
	pages?: Pages;
	webServices?: WebServices;
	httpRuntime?: HTTPRuntime;
	identity?: Identity;
}

export interface Authentication {
	_attributes: AuthenticationAttributes;
}

export interface AuthenticationAttributes {
	mode: string;
}

export interface SystemWebAuthorization {
	deny?: DenyClass;
	allow?: DenyClass;
}

export interface DenyClass {
	_attributes: DenyAttributes;
}

export interface DenyAttributes {
	users: Headers;
}

export enum Headers {
	Empty = '?',
	Headers = '*',
}

export interface Globalization {
	_attributes: GlobalizationAttributes;
}

export interface GlobalizationAttributes {
	culture: string;
	uiCulture: string;
}

export interface HTTPRuntime {
	_attributes: HTTPRuntimeAttributes;
}

export interface HTTPRuntimeAttributes {
	executionTimeout: string;
	requestValidationMode: string;
	maxRequestLength: string;
	enableVersionHeader: string;
	relaxedUrlToFileSystemMapping: string;
}

export interface Identity {
	_attributes: IdentityAttributes;
}

export interface IdentityAttributes {
	impersonate: string;
}

export interface MachineKey {
	_attributes: MachineKeyAttributes;
}

export interface MachineKeyAttributes {
	validationKey: string;
	decryptionKey: string;
	validation: string;
}

export interface Membership {
	_attributes: MembershipAttributes;
	providers: MembershipProviders;
}

export interface MembershipAttributes {
	defaultProvider: string;
}

export interface MembershipProviders {
	remove: RemoveElement[];
	add: PurpleAdd;
}

export interface PurpleAdd {
	_attributes: IndecentAttributes;
}

export interface IndecentAttributes {
	name: string;
	type: string;
	mainProviderType: string;
	enablePasswordRetrieval: string;
	enablePasswordReset: string;
	requiresQuestionAndAnswer: string;
	applicationName: string;
	requiresUniqueEmail: string;
	passwordFormat: string;
	maxInvalidPasswordAttempts: string;
	minRequiredPasswordLength: string;
	minRequiredNonalphanumericCharacters: string;
	passwordAttemptWindow: string;
	passwordStrengthRegularExpression: string;
}

export interface Pages {
	_attributes: PagesAttributes;
	controls: Controls;
}

export interface PagesAttributes {
	styleSheetTheme: string;
	controlRenderingCompatibilityVersion: string;
	clientIDMode: string;
}

export interface Controls {
	add: ControlsAdd[];
}

export interface ControlsAdd {
	_attributes: HilariousAttributes;
}

export interface HilariousAttributes {
	tagPrefix: string;
	assembly?: string;
	namespace?: string;
	tagName?: string;
	src?: string;
}

export interface RoleManager {
	_attributes: RoleManagerAttributes;
	providers: RoleManagerProviders;
}

export interface RoleManagerAttributes {
	enabled: string;
	defaultProvider: string;
	cacheRolesInCookie: string;
}

export interface RoleManagerProviders {
	remove: RemoveElement[];
	add: FluffyAdd;
}

export interface FluffyAdd {
	_attributes: AmbitiousAttributes;
}

export interface AmbitiousAttributes {
	applicationName: string;
	name: string;
	type: string;
	mainProviderType?: string;
	administratorRole?: string;
}

export interface SecurityPolicy {
	trustLevel: TrustLevel;
}

export interface TrustLevel {
	_attributes: TrustLevelAttributes;
}

export interface TrustLevelAttributes {
	name: string;
	policyFile: string;
}

export interface SessionState {
	_attributes: SessionStateAttributes;
	providers: SessionStateProviders;
}

export interface SessionStateAttributes {
	cookieless: string;
	mode: string;
	customProvider: string;
	timeout: string;
	sessionIDManagerType: string;
}

export interface SessionStateProviders {
	remove: RemoveElement;
	add: TentacledAdd;
}

export interface TentacledAdd {
	_attributes: CunningAttributes;
}

export interface CunningAttributes {
	name: string;
	type: string;
	ignoreUrl: string;
}

export interface SiteMap {
	_attributes: SiteMapAttributes;
	providers: SiteMapProviders;
}

export interface SiteMapAttributes {
	enabled: string;
	defaultProvider: string;
}

export interface SiteMapProviders {
	remove: RemoveElement[];
	add: StickyAdd[];
}

export interface StickyAdd {
	_attributes: MagentaAttributes;
}

export interface MagentaAttributes {
	name: string;
	type: string;
	securityTrimmingEnabled: string;
	table?: string;
}

export interface Trace {
	_attributes: TraceAttributes;
}

export interface TraceAttributes {
	enabled: string;
	localOnly: string;
	traceMode: string;
	pageOutput: string;
}

export interface Trust {
	_attributes: TrustAttributes;
}

export interface TrustAttributes {
	level: string;
	originUrl: string;
}

export interface WebParts {
	personalization: Personalization;
}

export interface Personalization {
	authorization: PersonalizationAuthorization;
}

export interface PersonalizationAuthorization {
	allow: PurpleAllow;
}

export interface PurpleAllow {
	_attributes: FriskyAttributes;
}

export interface FriskyAttributes {
	verbs: string;
	users: string;
}

export interface WebServices {
	protocols: CustomHeaders;
	soapExtensionTypes: SoapExtensionTypes;
	wsdlHelpGenerator: WSDLHelpGenerator;
}

export interface CustomHeaders {
	remove: RemoveElement;
}

export interface SoapExtensionTypes {
	add: SoapExtensionTypesAdd;
}

export interface SoapExtensionTypesAdd {
	_attributes: MischievousAttributes;
}

export interface MischievousAttributes {
	type: string;
	priority: string;
	group: string;
}

export interface WSDLHelpGenerator {
	_attributes: WSDLHelpGeneratorAttributes;
}

export interface WSDLHelpGeneratorAttributes {
	href: string;
}

export interface PxCore {
	pxdatabase: Pxdatabase;
	pxaccess: Pxaccess;
	pxtrace: Pxtrace;
	pxtranslate: Pxtranslate;
	odata: Odata;
	activeDirectory: ActiveDirectory;
	formsAuth: FormsAuth;
	externalAuth: ExternalAuth;
	multiAuth: MultiAuth;
	payrollWebServiceConfiguration: PayrollWebServiceConfiguration;
	aatrixConfiguration: AatrixConfiguration;
}

export interface AatrixConfiguration {
	_attributes: AatrixConfigurationAttributes;
}

export interface AatrixConfigurationAttributes {
	webformsUrl: string;
	vendorID: string;
	transactionTimeoutMs: string;
	getAvailableFormsListEndpoint: string;
	uploadAufEndpoint: string;
}

export interface ActiveDirectory {
	_attributes: ActiveDirectoryAttributes;
}

export interface ActiveDirectoryAttributes {
	enabled: string;
	path: string;
	user: string;
	password: string;
}

export interface ExternalAuth {
	_attributes: ExternalAuthAttributes;
	providers: ExternalAuthProviders;
}

export interface ExternalAuthAttributes {
	authUrl: string;
	silentLogin: string;
	externalLogout: string;
	selfAssociate: string;
	instanceKey: string;
	claimsAuth: string;
}

export interface ExternalAuthProviders {
	remove: RemoveElement[];
	add: SectionElement[];
}

export interface FormsAuth {
	_attributes: FormsAuthAttributes;
}

export interface FormsAuthAttributes {
	loginUrl: string;
	timeout: string;
}

export interface MultiAuth {
	locations: Locations;
}

export interface Locations {
	clear: Clear;
}

export interface Odata {
	_attributes: OdataAttributes;
	cors: Cors;
}

export interface OdataAttributes {
	showInitializationErrors: string;
}

export interface Cors {
	_attributes: CorsAttributes;
}

export interface CorsAttributes {
	enabled: string;
	origins: Headers;
	methods: Headers;
	headers: Headers;
	exposedHeaders: string;
}

export interface PayrollWebServiceConfiguration {
	_attributes: PayrollWebServiceConfigurationAttributes;
}

export interface PayrollWebServiceConfigurationAttributes {
	endpointAddress: string;
	overrideRestEndpointAddress: string;
	overrideWcfEndpointAddress: string;
	transactionTimeoutMs: string;
	restApiRoute: string;
	serverMaxReceivedMessageSize: string;
	payloadRatio: string;
}

export interface Pxaccess {
	_attributes: MembershipAttributes;
	providers: PxaccessProviders;
}

export interface PxaccessProviders {
	remove: RemoveElement;
	add: FluffyAdd;
}

export interface Pxdatabase {
	_attributes: MembershipAttributes;
	providers: PxdatabaseProviders;
}

export interface PxdatabaseProviders {
	remove: RemoveElement;
	add: IndigoAdd;
}

export interface IndigoAdd {
	_attributes: BraggadociousAttributes;
}

export interface BraggadociousAttributes {
	name: string;
	type: string;
	connectionStringName: string;
	companyID: string;
	secureCompanyID: string;
}

export interface Pxtrace {
	providers: PxtraceProviders;
}

export interface PxtraceProviders {
	remove: RemoveElement;
	add: SectionElement;
}

export interface Pxtranslate {
	_attributes: MembershipAttributes;
	providers: PxtraceProviders;
}

export interface Runtime {
	assemblyBinding: AssemblyBinding;
}

export interface AssemblyBinding {
	_attributes: AssemblyBindingAttributes;
	dependentAssembly: DependentAssembly[];
}

export interface AssemblyBindingAttributes {
	xmlns: string;
}

export interface DependentAssembly {
	assemblyIdentity: AssemblyIdentity;
	bindingRedirect: BindingRedirect;
}

export interface AssemblyIdentity {
	_attributes: AssemblyIdentityAttributes;
}

export interface AssemblyIdentityAttributes {
	name: string;
	publicKeyToken: string;
	culture?: Culture;
}

export enum Culture {
	Neutral = 'neutral',
}

export interface BindingRedirect {
	_attributes: BindingRedirectAttributes;
}

export interface BindingRedirectAttributes {
	oldVersion: string;
	newVersion: string;
}

export interface SystemCodedom {
	compilers: Compilers;
}

export interface Compilers {
	compiler: Compiler[];
}

export interface Compiler {
	_attributes: CompilerAttributes;
}

export interface CompilerAttributes {
	language: string;
	extension: string;
	type: string;
	warningLevel: string;
	compilerOptions: string;
}

export interface SystemServiceModel {
	serviceHostingEnvironment: ServiceHostingEnvironment;
	behaviors: Behaviors;
	bindings: Bindings;
	client: Client;
}

export interface Behaviors {
	serviceBehaviors: ServiceBehaviors;
}

export interface ServiceBehaviors {
	behavior: Behavior;
}

export interface Behavior {
	serviceDebug: ServiceDebug;
}

export interface ServiceDebug {
	_attributes: ServiceDebugAttributes;
}

export interface ServiceDebugAttributes {
	includeExceptionDetailInFaults: string;
}

export interface Bindings {
	basicHttpBinding: BasicHTTPBinding;
}

export interface BasicHTTPBinding {
	binding: Binding;
}

export interface Binding {
	_attributes: BindingAttributes;
	readerQuotas: ReaderQuotas;
	security: BindingSecurity;
}

export interface BindingAttributes {
	maxBufferPoolSize: string;
	maxReceivedMessageSize: string;
	maxBufferSize: string;
	transferMode: string;
	sendTimeout: string;
}

export interface ReaderQuotas {
	_attributes: ReaderQuotasAttributes;
}

export interface ReaderQuotasAttributes {
	maxDepth: string;
	maxStringContentLength: string;
	maxArrayLength: string;
	maxBytesPerRead: string;
	maxNameTableCharCount: string;
}

export interface BindingSecurity {
	_attributes: AuthenticationAttributes;
	transport: Transport;
}

export interface Transport {
	_attributes: TransportAttributes;
}

export interface TransportAttributes {
	clientCredentialType: string;
}

export interface Client {
	endpoint: Endpoint;
}

export interface Endpoint {
	_attributes: EndpointAttributes;
}

export interface EndpointAttributes {
	binding: string;
	contract: string;
	name: string;
}

export interface ServiceHostingEnvironment {
	_attributes: ServiceHostingEnvironmentAttributes;
}

export interface ServiceHostingEnvironmentAttributes {
	aspNetCompatibilityEnabled: string;
}

export interface ConfigurationSystemWeb {
	compilation: Compilation;
}

export interface Compilation {
	_attributes: CompilationAttributes;
	codeSubDirectories: Clear;
	assemblies: Assemblies;
	buildProviders: BuildProviders;
}

export interface CompilationAttributes {
	debug: string;
	defaultLanguage: string;
	numRecompilesBeforeAppRestart: string;
	targetFramework: string;
	batch: string;
	optimizeCompilations: string;
	tempDirectory: string;
}

export interface Assemblies {
	add: AssembliesAdd[];
}

export interface AssembliesAdd {
	_attributes: Attributes1;
}

export interface Attributes1 {
	assembly: string;
}

export interface BuildProviders {
	add: BuildProvidersAdd;
}

export interface BuildProvidersAdd {
	_attributes: Attributes2;
}

export interface Attributes2 {
	extension: string;
	type: string;
}

export interface SystemWebServer {
	validation: Validation;
	security: SystemWebServerSecurity;
	staticContent: StaticContent;
	defaultDocument: DefaultDocument;
	httpProtocol: HTTPProtocol;
	handlers: Handlers;
	modules: Modules;
	httpCompression: HTTPCompression;
}

export interface DefaultDocument {
	files: Locations;
}

export interface Handlers {
	remove: RemoveElement[];
	add: HandlersAdd[];
}

export interface HandlersAdd {
	_attributes: Attributes3;
}

export interface Attributes3 {
	name: string;
	path: string;
	verb: string;
	type: string;
}

export interface HTTPCompression {
	_attributes: HTTPCompressionAttributes;
	scheme: Scheme;
	dynamicTypes: ICTypes;
	staticTypes: ICTypes;
}

export interface HTTPCompressionAttributes {
	directory: string;
}

export interface ICTypes {
	add: DynamicTypesAdd[];
}

export interface DynamicTypesAdd {
	_attributes: Attributes4;
}

export interface Attributes4 {
	mimeType: string;
	enabled: string;
}

export interface Scheme {
	_attributes: SchemeAttributes;
}

export interface SchemeAttributes {
	name: string;
	dll: string;
	dynamicCompressionLevel: string;
}

export interface HTTPProtocol {
	customHeaders: CustomHeaders;
}

export interface Modules {
	_attributes: ModulesAttributes;
	remove: RemoveElement[];
	add: SectionElement;
}

export interface ModulesAttributes {
	runAllManagedModulesForAllRequests: string;
}

export interface SystemWebServerSecurity {
	requestFiltering: RequestFiltering;
}

export interface RequestFiltering {
	verbs: Verbs;
	requestLimits: RequestLimits;
}

export interface RequestLimits {
	_attributes: RequestLimitsAttributes;
}

export interface RequestLimitsAttributes {
	maxAllowedContentLength: string;
}

export interface Verbs {
	_attributes: VerbsAttributes;
	remove: VerbsRemove;
	add: VerbsAdd;
}

export interface VerbsAttributes {
	allowUnlisted: string;
}

export interface VerbsAdd {
	_attributes: Attributes5;
}

export interface Attributes5 {
	allowed: string;
	verb: string;
}

export interface VerbsRemove {
	_attributes: Attributes6;
}

export interface Attributes6 {
	verb: string;
}

export interface StaticContent {
	clientCache: ClientCache;
}

export interface ClientCache {
	_attributes: ClientCacheAttributes;
}

export interface ClientCacheAttributes {
	cacheControlMode: string;
	cacheControlMaxAge: string;
}

export interface Validation {
	_attributes: ValidationAttributes;
}

export interface ValidationAttributes {
	validateIntegratedModeConfiguration: string;
}
