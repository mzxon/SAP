namespace app.interactions;

using{ Country } from '@sap/cds/common'; //Country 객체 사용
type BusinessKey : String(10);           //전역변수
type SDate : DateTime;                   //날짜와 시간 모두 포함하는 타입
type LText : String(1024);

entity Interactions_Header {
    key ID : Integer;
    ITEMS : Composition of many Interactions_Items on ITEMS.INTHeader = $self;
    //Composition : 부모-자식 관계
    //ITEMS 필드가 Interactions_Items 엔티티를 참조하고 있으므로 Interactions_Items의 INTHeader 필드가 현재 엔티티의 Key 필드와 동일해야함
    PARTNER : BusinessKey;
    LOG_DATE : SDate;
    BPCOUNTRY : Country;
};

entity Interactions_Items {
    key INTHeader : association to Interactions_Header;
    key TEXT_ID : BusinessKey;
    LANGU : String(2);
    LOGTEXT : LText;
}

