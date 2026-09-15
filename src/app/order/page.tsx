import { LargeTitle } from "../../components/LargeTitle";
import { RequireAuth } from "../../components/RequireAuth";
export default function OrderPage() { return <RequireAuth><LargeTitle>Order</LargeTitle></RequireAuth>; }
