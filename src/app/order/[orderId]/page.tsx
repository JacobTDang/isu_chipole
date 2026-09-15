import { LargeTitle } from "../../../components/LargeTitle";
import { RequireAuth } from "../../../components/RequireAuth";
export default function ConfirmationPage() { return <RequireAuth><LargeTitle>Order confirmation</LargeTitle></RequireAuth>; }
