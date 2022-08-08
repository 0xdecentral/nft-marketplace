import TopSeller from "@components/top-seller/layout-02";
import { useEffect, useState } from "react";

const BidsTabContent = ({ orders }) => {
    const [lastOrder, setLastOrder] = useState();

    useEffect(() => {
        if (!orders) return;
        setLastOrder(orders[orders.length - 1]);
    }, [orders]);

    return (
        <div>
            {lastOrder?.subOrders
                .slice()
                .reverse()
                .map((order) => (
                    <TopSeller
                        key={order.created}
                        name={order.account}
                        eth={order.price}
                        path={"/"}
                        time={order.created}
                        image={{
                            src: "/images/avatar/default.png",
                            width: 44,
                            height: 44,
                        }}
                    />
                ))}
        </div>
    );
};

export default BidsTabContent;
