using { sap.capire.products as db } from '../db/schema';
//해당 경로에서 가져와서 사용

//서비스 AdminService 생성
service AdminService {
    entity Products   as projection on db.Products;
    entity Categories as projection on db.Categories;
}
// as projection on
// rap에서 cds view를 만드는 거랑 유사함
// 엔티티를 참조하여 새로운 엔티티를 정의함