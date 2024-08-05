using app.interactions from '../db/interactions';

service CatalogSerivce{ //경로 지정 안함 : 자동으로 할당됨
    entity Interactions_Header
        as projection on interactions.Interactions_Header;
    entity Interactions_Items
        as projection on interactions.Interactions_Items;
}

//as projection on : 다른 네임스페이스에 있는 엔티티를 현재 서비스에서 사용할 수 있도록 함
//                   해당 엔티티는 projection하는 엔티티의 구조를 그대로 따름
