import { LargeTitle } from "../../components/LargeTitle";
import { RequireAuth } from "../../components/RequireAuth";
export default function BagPage() { return <RequireAuth><LargeTitle>Bag</LargeTitle></RequireAuth>; }
