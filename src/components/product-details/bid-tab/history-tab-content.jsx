import TopSeller from "@components/top-seller/layout-02";
import { useEffect, useState } from "react";

const HistoryTabContent = ({ orders }) => {
    const [lastOrder, setLastOrder] = useState();

    useEffect(() => {
        if (!orders) return;
        setLastOrder(orders[orders.length - 1]);
    }, [orders]);

    return (
        <div>
            {orders
                ?.slice()
                .reverse()
                .map((order) => {
                    return (
                        <>
                            {order.subOrders
                                .slice()
                                .reverse()
                                .map((subOrder) => (
                                    <TopSeller
                                        key={subOrder.created}
                                        name={subOrder.account}
                                        eth={subOrder.price}
                                        path={"/"}
                                        time={subOrder.created}
                                        type={subOrder.type}
                                        image={{
                                            src: "/images/avatar/default.png",
                                            width: 44,
                                            height: 44,
                                        }}
                                    />
                                ))}
                            <TopSeller
                                key={order.startTime}
                                name={order.creator}
                                eth={order.startingPrice}
                                path={"/"}
                                time={order.startTime}
                                type={order.type}
                                image={{
                                    src: "/images/avatar/default.png",
                                    width: 44,
                                    height: 44,
                                }}
                            />
                        </>
                    );
                })}
        </div>
    );
};

export default HistoryTabContent;
