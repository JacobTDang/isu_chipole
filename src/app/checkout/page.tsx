import { LargeTitle } from "../../components/LargeTitle";
import { RequireAuth } from "../../components/RequireAuth";
export default function CheckoutPage() { return <RequireAuth><LargeTitle>Checkout</LargeTitle></RequireAuth>; }
