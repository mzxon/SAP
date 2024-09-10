//사용자 정의 이벤트 핸들러 정의

package customer.java_project.handlers;

import java.util.HashMap; //HashMap 클래스 사용 HashMap<String, Integer> map = new HashMap<>();
import java.util.Map;     //Map 인터페이스 사용 -> map을 구현한 다양한 클래스를 사용할 수 있음 (hashmap, treemap, linkedhashmap) -> 필요에 따라 구현체를 바꿔 사용할 수 있음
// Map : 인터페이스
// 인터페이스를 구현한 클래스 : 같은 메서드를 가지고 있음 => map은 구현체를 자유롭게 오고 갈 수 있음
// 인스턴스를 생성할 때는 해당 클래스를 명시적으로 import 해줘야함

import org.springframework.stereotype.Component; //Spring 프레임워크에서 사용되는 어노테이션을 가져옴
//@Component : Spring 컨테이너에게 해당 클래스가 Spring의 bean으로 관리되어야 한다는 것을 알림
// bean : spring 컨테이너에 의해 생성되고 관리되는 인스턴스 (가게->전기, 수도)
// 생명주기, 의존성 주입, 설정 등의 기능 관리가 가능함

/* CAP 관련 Import 구문 */
import com.sap.cds.services.cds.CdsCreateEventContext;       //CDS 생성이벤트에 대한 정보를 담고 있음
import com.sap.cds.services.cds.CdsReadEventContext;         //CDS 읽기이벤트에 대한 정보를 담고 있음
import com.sap.cds.services.cds.CqnService;                  //SAP의 쿼리 언어인 CQN를 사용하여 쿼리 수행하는 서비스 정의
import com.sap.cds.services.handler.EventHandler;            //이벤트 핸들러 정의(로직 작성) : 해당 인터페이스를 구현한 클래스는 이벤트 메서드 로직을 작성할 수 있음
import com.sap.cds.services.handler.annotations.On;          //이벤트 핸들러 등록            : 클래스의 메서드가 어떤 이벤트에 의해 호출되는지를 정의함
import com.sap.cds.services.handler.annotations.ServiceName; //서비스 이름 지정

@Component //클래스를 빈으로 자동 등록 -> 의존성 주입을 통해 다른 빈에 주입되거나 주입받을 수 있음 (@Autowired)
@ServiceName("AdminService") //핸들러 적용할 서비스 이름
public class AdminService implements EventHandler { //이벤트 핸들러 인터페이스 구현

    private Map<Object, Map<String, Object>> products = new HashMap<>(); //HashMap 인스턴스 생성

    //create 이벤트 핸들러
    @On(event = CqnService.EVENT_CREATE, entity = "AdminService.Product") //entity = 'AdminService.Products' => AdminService 라는 서비스에서 Products라는 엔티티를 가리킴
    public void onCreate(CdsCreateEventContext context) { //CdsCreateEventContext 타입의 객체를 인자(context)로 받음
        // CdsCreateEventContext : 생성 이벤트와 관련된 정보
        context.getCqn().entries().forEach(e -> products.put(e.get("ID"), e));
        // getCqn() : 생성 이벤트와 관련된 CQN 쿼리 객체를 반환홤
        // entries() : CQN 쿼리에서 반환된 데이터 항목들(결과값)을 리스트 형태로 제공
        // put() :  저장 / get() : 추출
        context.setResult(context.getCqn().entries()); //이벤트 처리 결과를 설정하는데 사용됨
        //쿼리 객체를 리스트로 제공하고 이걸 처리 결과로 설정함 
    }

    //read 이벤트 핸들러
    @On(event = CqnService.EVENT_READ, entity = "AdminService.Product")
    public void onRead(CdsReadEventContext context) {
        context.setResult(products.values()); //products.values()는 map 객체에서 모든 값을 반환하는 메서드 => map의 값들만을 collection 형태로 제공함
    }

}
