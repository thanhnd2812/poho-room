import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, or, query, where } from "firebase/firestore";
import { cache } from "react";
import { FirebaseUser } from "../definitions";
import { comparePassword } from "../utils";

export const getUserByPhoneAndPassword = async (phone: string, password: string) => {

  try {
    const vnPrefixNumber =
      phone.startsWith("0") && (phone.length === 10 || phone.length === 11)
        ? phone.replace("0", "+84")
        : phone;

    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      or(where("phone", "==", vnPrefixNumber), where("phone", "==", phone))
    );
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => doc.data());
    if (users.length === 0) {
      return null;
    }
    const user = users[0];
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getUserById = cache(async (id: string) => {
  const user = await getDoc(doc(db, "users", id));
  const data = user.data();
  if (!data) {
    return null;
  }
  return {
    uid: user.id,
    phone: data.phone,
    fullname: data.fullname,
    email: data.email,
    avatarUrl: data.avatarUrl,
    points: data.points,
  } as FirebaseUser;
});