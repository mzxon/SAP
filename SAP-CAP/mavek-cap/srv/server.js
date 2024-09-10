const cds = require('@sap/cds'); //CAP 프레임워크 모듈 불러옴

class CatalogService extends cds.ApplicationService { init() {

        const { Customers, Orders } = this.entities;

        this.before('CREATE', 'Customers', (req) => { 
            req.data.ID = cds.utils.uuid();
        });

        this.before('CREATE', 'Orders', (req) => {
            req.data.ID = cds.utils.uuid();
        });
        
        this.on('confirmOrder', async (req) => {
            const { orderID } = req.data; 
            const order = await SELECT.one.from(Orders).where({ ID : orderID });

            if (order) {
                await UPDATE(Orders).set({ status: 'Confirmed '}).where({ ID : orderID });
                return true;
            }
        });

        this.on('getCustomerOrders', async (req) => {
            if (each.email) each.email = maskEmail(each.email);
        });

        function maskEmail(email){
            let [local, domain] = email.split('@');
            return '${local.slice(0, 2)}***@${domain}';
        }
    }
}

module.exports = new CatalogService




// //서비스 계층 로직 구현
// module.exports = cds.service.impl (async function() {
//     //cds.service.impl : 하나의 콜백 함수(서비스 구현 로직 포함)를 인수로 받는 메서드
//     //async function : js의 비동기 함수, 해당 서비스가 비동기적으로 수행됨
//     //  - 항상 promise 반환함  
//     //      -> promise가 명시되지 않아도 결과값이 promise.resolve(~) 라고 생각한다는 뜻
//     //  - await : promise가 수행될 떄까지 기다리고 promise 결과값을 받음
//     //      -> 명시되지 않아도 promise를 반환한다고 가정하고 처리함

//     console.log("-------------A---------------");
//     // const model = await cds.load('*');
    
//     // const Customers = model.definitions['my.Customer'];
//     // const Orders = model.definitions['my.Order'];
    
//     console.log("-------------B---------------");
//     //const { Customers, Orders } = this.entities; //구조 분해 할당 : 객체나 배열에서 값을 추출해서 변수에 할당함
//     //엔티티 중에서 Customers, Orders를 가져와서 Customers, Orders 변수에 할당

//     this.before('CREATE', 'Customers', (req) => { 
//         //Customers엔티티가 Create 요청 처리 전에 실행되는 함수
//         //req : 요청 객체 (요청 정보-body)
//         req.data.ID = cds.utils.uuid(); //CAP에서 UUID 생성
//     });
    
//     console.log("------------C----------------");

//     this.before('CREATE', 'Orders', (req) => {
//         req.data.ID = cds.utils.uuid();
//     });
    
//     console.log("------------D----------------");
    
//     this.on('confirmOrder', async (req) => { //this.on : 특정 이벤트 발생 시 호출될 핸들러 함수 등록
//         //confirmOrder 액션이 호출될 때 지금 헨들러가 실행됨
//         const { orderID } = req.data; //구조 분해 할당 : req.data중에서 orderID가져옴
//         const order = await SELECT.one.from(Orders).where({ ID : orderID }); //promise.resolve
//         //SELECT ~ WHERE 쿼리가 반환하는 Promise의 결과값을 await가 받음
//         //Orders에서 조건에 맞는 레코드 하나를 가져와서 변수에 넣음 (레코드 여러개면 첫 번째 레코드만)
//         /* 명시적으로 promise 사용하면
//         SELECT.one.from(Orders).where({ ID: orderID })
//             .then(order => {
//             // Promise가 성공적으로 해결된 경우의 처리
//             console.log('Order found:', order);
//             // 필요한 경우 order를 반환하거나 추가 처리 수행
//         })
//             .catch(error => {
//             // Promise가 거부된 경우의 처리
//             console.error('Error while fetching order:', error);
//             // 필요한 경우 오류 처리를 수행
//         });
//         */
        
//         if (order) {
//             await UPDATE(Orders).set({ status: 'Confirmed '}).where({ ID : orderID });
//             return true;
//         }
//     });

//     //getCustomerOrders이벤트 발생 시 핸들러 호출
//     this.on('getCustomerOrders', async (req) => {
//         if (each.email) each.email = maskEmail(each.email);
//     });

//     function maskEmail(email){
//         let [local, domain] = email.split('@');
//         return '${local.slice(0, 2)}***@${domain}';
//     }
// })
