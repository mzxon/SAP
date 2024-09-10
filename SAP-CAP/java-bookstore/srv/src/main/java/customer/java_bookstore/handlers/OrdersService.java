package customer.java_bookstore.handlers;

import cds.gen.ordersservice.OrdersService_;
//cds.gen : 서비스나 엔티티를 정의하면서 자동으로 생기는 관련 코드나 패키지들
// => 엔티티 데이터 접근 등 개발자의 작업을 단순화함
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.stereotype.Component;

import java.util.List; //List 인터페이스 사용
import org.springframework.beans.factory.annotation.Autowired;
//Autowired : bean 의존성 주입 -> 다른 클래스 사용

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
//-> Java SDK에서 사용되는 클래스 : 실질적인 쿼리 작성
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
//-> CAP CQN을 나타내는 인터페이스 : 쿼리를 CQN 형태로 표현
//-> select, update 클래스에서 쿼리 작성 -> cqnselect, cqnupdate 객체로 변환 -> CAP 시스템 내부에서 사용
import com.sap.cds.services.ErrorStatuses; //오류 상태 나타내는 상수로 나타냄
import com.sap.cds.services.ServiceException; //예외처리
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.annotations.Before;
//Before : 특정 이벤트가 발생하기 전에 실행할 메서드
import com.sap.cds.services.persistence.PersistenceService;
//PersistenceService : DB와 상호작용하는 서비스 제공 (CRUD기능 제공)

import cds.gen.ordersservice.OrderItems;
import cds.gen.ordersservice.OrderItems_;
//cds.gen ~   : CAP에서 생성된 특정 엔티티의 클래스 또는 인터페이스 -> 엔티티 전체 구조를 나타내며 getterm setter 메서드를 가지고 있음(인스턴스로 데이터 접근)
//cds.gen ~ _ : 엔티티의 필드와 메타데이터에 대한 참조를 제공하는 구조체 또는 클래스 -> CQN 쿼리 작성을 위해 사용, 안전한 타입 방식으로 참조할 수 있음 (OrderItem_.Name 이런식으로)
 
import cds.gen.ordersservice.Orders;
import cds.gen.ordersservice.Orders_;
import cds.gen.sap.capire.bookstore.Books;
import cds.gen.sap.capire.bookstore.Books_;

import java.math.BigDecimal;
import com.sap.cds.services.handler.annotations.After;

@Component
@ServiceName(OrdersService_.CDS_NAME)
public class OrdersService implements EventHandler {
    @Autowired
    PersistenceService db; 
    //PersistenceService : CAP모델에서 데이터베이스와 상호작용을 담당하는 서비스 객체

    //주문아이템 생성
    @Before(event = CqnService.EVENT_CREATE, entity = OrderItems_.CDS_NAME)
    public void validateBookAndDecreaseStock(List<OrderItems> items) {
        for (OrderItems item : items) {
            String bookId = item.getBookId(); //cds.gen에 포함된 메서드
            Integer amount = item.getAmount(); //주문량

            // check if the book that should be ordered is existing
            //주문한 상품이 존재하는지 체크
            CqnSelect sel = Select.from(Books_.class).columns(b -> b.stock()).where(b -> b.ID().eq(bookId));
            //Books_.class : CQN 쿼리 사용할 때 쿼리 대상 지정 
            //b : 쿼리에서 엔티티의 필드와 메서드 접근용
            //b->b.stock : 엔티티 필드 중 stock를 선택하겠다
            Books book = db.run(sel).first(Books.class)
                    .orElseThrow(() -> new ServiceException(ErrorStatuses.NOT_FOUND, "Book does not exist"));
            //db.run(sel) : 쿼리 실행해서 결과 가져옴
            //first(Books.class) : 결과 첫번째 요소를 Books 객체로 변환
            //orElseThrow : 예외던짐
            //ServiceException : 서비스 계층 예외
            //ErrorStatuese : 오류 지정

            // check if order could be fulfilled
            //주문이 되는지 확인
            int stock = book.getStock(); //재고가져옴
            if (stock < amount) { //재고가 주문량보다 적으면
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Not enough books on stock");
            }

            // update the book with the new stock, means minus the order amount
            //재고 업데이트 (주문량 제외한)
            book.setStock(stock - amount);
            //재고에서 주문량 제외
            CqnUpdate update = Update.entity(Books_.class).data(book).where(b -> b.ID().eq(bookId));
            //쿼리 작성
            db.run(update);
            //업데이트 쿼리 실행
        } 
    }

    //주문 생성
    @Before(event = CqnService.EVENT_CREATE, entity = Orders_.CDS_NAME)
    public void validateBookAndDecreaseStockViaOrders(List<Orders> orders) {
        for (Orders order : orders) { //orders 컬렉션을 Orders 타입의 order 변수를 사용해 접근 (for문)
            if (order.getItems() != null) { //order의 order아이템 목록이 null이 아닌지 (주문내역이 있는지)
                validateBookAndDecreaseStock(order.getItems());//order 아이템 변경 함수 실행
            }
        }
    }

    //주문 금액 계산
    //OrderItem Read, Create 후처리 이벤트 핸들러
    @After(event = { CqnService.EVENT_READ, CqnService.EVENT_CREATE }, entity = OrderItems_.CDS_NAME)
    public void calculateNetAmount(List<OrderItems> items) {
        for (OrderItems item : items) {
            String bookId = item.getBookId();
 
            // get the book that was ordered
            //주문한 책 가져옴
            CqnSelect sel = Select.from(Books_.class).where(b -> b.ID().eq(bookId)); //쿼리작성
            Books book = db.run(sel).single(Books.class); //실행
            //single : 단일 객체 (보통 결과값 하나일거라 예상할때)

            // calculate and set net amount
            item.setNetAmount(book.getPrice().multiply(new BigDecimal(item.getAmount())));
            //BigDecimal : 고정 소수점 수치를 정확하게 표현 (곱셉 연산할때 정확한 계산을 위함)
            //multiply : BigDecimal 곱셈 수행할때 (A.multiply(B))

        }
    }

    //주문 총액 계산
    @After(event = { CqnService.EVENT_READ, CqnService.EVENT_CREATE }, entity = Orders_.CDS_NAME)
    public void calculateTotal(List<Orders> orders) {
        for (Orders order : orders) {
            // calculate net amount for expanded items
            if(order.getItems() != null) {
                calculateNetAmount(order.getItems());
            }

            // get all items of the order
            //주문한 모든 아이템 가져옴
            CqnSelect selItems = Select.from(OrderItems_.class).where(i -> i.parent().ID().eq(order.getId()));
            List<OrderItems> allItems = db.run(selItems).listOf(OrderItems.class);
            //listOf : 리스트 타입으로 반환
            
            // calculate net amount of all items
            calculateNetAmount(allItems);

            // calculate and set the orders total
            BigDecimal total = new BigDecimal(0);
            for(OrderItems item : allItems) {
                total = total.add(item.getNetAmount());
            }
            order.setTotal(total);
        }
    }

}
