using my from '../db/data-model';

service CatalogService {
    entity Customers as projection on my.Customer;
    entity Orders as projection on my.Order;

    type Order : my.Order{};

    action confirmOrder(orderID: UUID) returns Boolean;
    //action : 사용자 정의 동작
    // - 동작유형: 상태변경, 프로세스 트리거 등 
    // - 반환타입: 보통 boolean
    function getCustomerOrders(customerID: UUID) returns array of Order;
    //function : crud 관련
    // - 동작유형: 데이터 조회 및 계산 등
    // - 반환타입 : 배열, 계산 결과, 조회된 정보 등
}