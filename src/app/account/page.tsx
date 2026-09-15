import { LargeTitle } from "../../components/LargeTitle";
import { RequireAuth } from "../../components/RequireAuth";
export default function AccountPage() { return <RequireAuth><LargeTitle>Account</LargeTitle></RequireAuth>; }
