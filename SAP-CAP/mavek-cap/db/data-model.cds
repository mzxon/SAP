namespace my;

entity Customer {
    key ID  : UUID;
    name    : String;
    email   : String;
    address : String;
}

entity Order {
    key ID     : UUID;
    customerID : UUID;
    amount     : Decimal(10,2);
    status     : String;
}

service CatalogService {
    entity Customers as projection on my.Customer;
    entity Orders as projection on my.Order;
}