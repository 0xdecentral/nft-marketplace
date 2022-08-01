import { currentUnixTimestamp } from "@utils/formatter";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    query,
    orderBy,
    onSnapshot,
    collection,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    arrayUnion,
    setDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAlWCvtS_mMiB4CNFuov4ERW6yNq8D9awI",
    authDomain: "nftproject-a9b42.firebaseapp.com",
    projectId: "nftproject-a9b42",
    storageBucket: "nftproject-a9b42.appspot.com",
    messagingSenderId: "987430342358",
    appId: "1:987430342358:web:c01e58ba297b1d85b64377",
    measurementId: "G-47HW5K0YSC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createUser = (address) => {
    const userRef = doc(db, "users", address.toLowerCase());

    setDoc(userRef, {
        created: serverTimestamp().toString(),
        address: address,
    });
};

export const createNFT = (id, data) => {
    const nftRef = doc(db, "nfts", id.toLowerCase());

    setDoc(nftRef, {
        created: serverTimestamp(),
        ...data,
    });
};

export const updateNFT = async (cid, data) => {
    const nftRef = doc(db, "nfts", cid.toLowerCase());

    return updateDoc(nftRef, data);
};

export const getNft = async (cid) => {
    const nftRef = doc(db, "nfts", cid.toLowerCase());

    const docData = await getDoc(nftRef);

    return docData.data();
};

export const getNfts = async () => {
    const nftsref = query(collection(db, "nfts"), orderBy("created", "desc"));

    const docs = (await getDocs(nftsref)).docs;

    return docs;
};

export const getUser = async (cid) => {
    const userRef = doc(db, "users", cid.toLowerCase());

    const docData = await getDoc(userRef);

    return docData.data();
};

export const getUsers = async () => {
    const usersRef = query(collection(db, "users"), orderBy("created", "asc"));

    const docs = await getDocs(usersRef);

    return docs;
};

export const getOrder = async (id) => {
    const orderRef = doc(db, "orders", id.toLowerCase());

    const docData = await getDoc(orderRef);

    return docData.data();
};

export const createOrUpdateOrder = async (id, data) => {
    await updateNFT(id, {
        status: data.type,
    });

    const orderRef = doc(db, "orders", id.toLowerCase());

    const docData = await getDoc(orderRef);

    const existingOrder = docData.data();

    const newOrder = {
        // 'fixed' | 'auction'
        type: data.type,
        startingPrice: data.price,
        payToken: data.tokenAddress,
        startTime: currentUnixTimestamp(),
        endTime: data.endTime,
        acceptedAccount: null,
        acceptedAmount: 0,
        subOrders: [],
    };

    if (!existingOrder) {
        setDoc(orderRef, {
            created: serverTimestamp(),
            // 'fixed' | 'auction' | 'completed'
            status: data.type,
            address: data.address,
            tokenId: data.tokenId,
            orders: [newOrder],
        });
    } else {
        existingOrder.orders.push(newOrder);
        existingOrder.status = data.type;

        setDoc(orderRef, existingOrder);
    }
};

export const createSubOrder = async (id, data) => {
    const orderRef = doc(db, "orders", id.toLowerCase());

    const docData = await getDoc(orderRef);

    const existingOrder = docData.data();

    if (!existingOrder) {
        return;
    } else {
        const order = existingOrder.orders[existingOrder.orders.length - 1];

        if (data.type === "accepted") {
            order.acceptedAccount = data.account;
            order.acceptedAmount = data.price;

            existingOrder.status = null;

            await updateNFT(id, {
                owner: data.account,
                status: null,
            });
        }

        order.subOrders.push({
            price: data.price,
            account: data.account,
            created: currentUnixTimestamp(),
            type: data.type,
        });

        setDoc(orderRef, existingOrder);
    }
};

// export const updateNFT = (cid, data) => {
//     const nftsRef = collection(db, "nfts");

//     getDocs(nftsRef)
//         .then((querySnapshot) => querySnapshot.docs)
//         .then((nfts) => nfts.find((nft) => nft.data().metadataCID === cid))
//         .then((item) =>
//             updateDoc(item.ref, {
//                 address: "123",
//             })
//         );
// };
