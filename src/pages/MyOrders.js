

import orderStyle from "../Styles/Order.module.css";
import { useValue} from "../userContext";


function MyOrders() {

    let {orders, setTotal, orderDB} = useValue();
    console.log("myOrders", orders);
    console.log("OrdersDB", orderDB);

    var totalPrice = 0;
    orders.map((item, i) => (
        totalPrice += item.price*orders[i].multiplier
    ));

    setTotal(totalPrice);

     return (
        <>
            <main>
                <div className={orderStyle.orderPage}>
                    <div className={orderStyle.orders}>
                        <h1>Your Orders</h1>
                    </div>
                        {orderDB.map((order, i) => (
                            <div key={i}>
                                <div className={orderStyle.ordered}>   
                                    <h2>Ordered On:- {order.orderPlacedDate}</h2>
                                </div>
                                <div className={orderStyle.tableForm}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {order?.item.map((item, k) => (
                                            <tr key={k}>
                                                <td>{item.title}</td>
                                                <td>&#8377; {item.price}</td>
                                                <td>{item.multiplier}</td>
                                                <td>&#8377; {item.total}</td>
                                            </tr>
                                        ))}
                                            <tr className={orderStyle.total}>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>&#8377; {order.total}</td>
                                            </tr>                            
                                        </tbody>
                                    </table>
                                </div>
                            </div> 
                        ))}
                </div>
            </main>
        </>
    )
}

export default MyOrders;