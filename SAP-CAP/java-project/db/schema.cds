namespace sap.capire.products;

using { Currency, cuid, managed, sap.common.CodeList } from '@sap/cds/common';
//Currency : 통화 관련
//cuid : SAP에서 제공하는 고유 식별자 생성기(현재 시간, 랜덤 값 등)
//managed : 표준 관리 기능을 사용할 것임을 나타냄
//sap.common.CodeList : CodeList : 특정 유형의 엔티티를 정의하는 데 사용되는 기본 개념 => 공통적으로 사용되는
//  ex) 신발가게라고 했을때 국가별 신발 사이즈 : codelist로 관리할 수 있음

entity Products : cuid, managed {
    //cuid    : 이 엔티티가 cuid로 식별됨 (자동으로 생성되는 고유 ID)
    //managed : SAP CAP의 관리 기능을 사용함 (생성일, 수정일 등 자동으로 관리함)
    title    : localized String(111);
    //localized : 다국어 지원
    descr    : localized String(1111);
    stock    : Integer;
    price    : Decimal(9,2);
    currency : Currency;
    category : Association to Categories;
    //Association : 연관관계
}

entity Categories : CodeList {
    //CodeList : 기본 엔티티로부터 상속
    key ID   : Integer;
    parent   : Association to Categories;
    //자기 자신과의 연관관계 : 카테고리 간의 상하 관계
    children : Composition of many Categories on children.parent = $self;
    //Composition : 부모-자식 간의 강한 결합(함께 생성, 삭제)
    //many : 여러 자식 (1:N)
    //$self : 현재 카테고리와 동일
}
