// Type definitions for amazon-mws

declare class BaseAmazonMWS {

    search(params: any): Promise<any>;

}

declare class Feeds extends BaseAmazonMWS {

    submit(params: any): Promise<any>;

}

declare class Finances extends BaseAmazonMWS {

}

declare class FulfillmentInboundShipment extends BaseAmazonMWS {

    create(params: any): Promise<any>;

}

declare class FulfillmentInventory extends BaseAmazonMWS {

}

declare class FulfillmentOutboundShipment extends BaseAmazonMWS {

}

declare class MerchantFulfillment extends BaseAmazonMWS {

    create(params: any): Promise<any>;

}

declare class Orders extends BaseAmazonMWS {

}

declare class Products extends BaseAmazonMWS {

    searchFor(params: any): Promise<any>;

}

declare class Reports extends BaseAmazonMWS {

}

declare class Sellers extends BaseAmazonMWS {

}

declare class AmazonMWS {

    constructor()

    constructor(key: string, token: string);

    setApiKey(key: string, secret: string): void;

    setHost(host?: string, port?: string, protocol?: string): void;

    feeds: Feeds;

    finances: Finances;

    fulfillmentInboundShipment: FulfillmentInboundShipment;

    fulfillmentInventory: FulfillmentInventory;

    fulfillmentOutboundShipment: FulfillmentOutboundShipment;

    merchantFulfillment: MerchantFulfillment;

    orders: Orders;

    products: Products;

    reports: Reports;

    sellers: Sellers;

}


declare namespace AmazonMWS {

}
export = AmazonMWS;