export type BackendOptions = {
    ssl: boolean,
    host: string,
    port: number,
    url: string
}

const host: string = document.querySelector('meta[name="x-backend-hostname"]')?.getAttribute("content")||window.location.hostname;

const sslMetaValue = document.querySelector('meta[name="x-backend-ssl"]')?.getAttribute("content");

let useSsl: boolean = window.location.protocol==="https:";
if (sslMetaValue&&!isNaN(+useSsl)) {
    useSsl = (+sslMetaValue)===1;
}

const portMetaValue = document.querySelector('meta[name="x-backend-port"]')?.getAttribute("content");

let port: number = useSsl?443:80;
if (portMetaValue&&!isNaN(+portMetaValue)) {
    port = +portMetaValue;
}

const url = `${useSsl?"https":"http"}://${host}:${port}`

const options: BackendOptions = {
    url, port, host, ssl: useSsl
}

console.log(options)

export default options;
