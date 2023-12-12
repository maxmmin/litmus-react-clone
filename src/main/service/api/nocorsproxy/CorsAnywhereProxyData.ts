interface ApiKeyData {
    readonly apiKey: string;
    readonly apiKeyHeader: string;
}

export default interface CorsAnywhereProxyData {
    readonly proxyUrlPrefix: string;
    readonly isApiKeyProtected: string;
    readonly apiKeyData: ApiKeyData|null;
}