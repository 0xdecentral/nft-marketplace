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
    const userRef = doc(db, "users", address);

    setDoc(userRef, {
        created: serverTimestamp(),
        address: address,
    });
};

export const createNFT = (data) => {
    const nftRef = doc(db, "nfts", data.metadataCID);

    setDoc(nftRef, {
        created: serverTimestamp(),
        ...data,
    });
};

export const updateNFT = (cid, data) => {
    const nftsRef = doc(db, "nfts", cid);

    updateDoc(nftsRef, data);
};

export const getUsers = () => {
    const usersRef = collection(db, "users");
    return getDocs(usersRef);
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
