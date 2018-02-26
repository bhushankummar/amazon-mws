// Type definitions for amazon-mws

declare class AmazonMWSReports {

    search(params: any): Promise<any>;

}


declare class AmazonMWS {

    constructor()

    constructor(key: string, token: string);

    setApiKey(key: string, secret: string): void;

    reports: AmazonMWSReports;

}


declare namespace AmazonMWS {

}
export = AmazonMWS;