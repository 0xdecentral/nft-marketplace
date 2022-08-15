import TopSeller from "@components/top-seller/layout-02";
import { isAddressSame } from "@utils/formatter";
import { useEffect, useState } from "react";
import { useUser } from "src/contexts/UserContext";

const BidsTabContent = ({ orderInfo }) => {
    const [lastOrder, setLastOrder] = useState();

    useEffect(() => {
        if (!orderInfo || !orderInfo.orders) return;

        const orders = orderInfo.orders;
        setLastOrder(orders[orders.length - 1]);
    }, [orderInfo]);

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
                        type={order.type}
                        image={{
                            src: "/images/avatar/default.png",
                            width: 44,
                            height: 44,
                        }}
                        creator={lastOrder.creator}
                        nftAddress={orderInfo.address}
                        tokenId={orderInfo.tokenId}
                    />
                ))}
        </div>
    );
};

export default BidsTabContent;
