import { LargeTitle } from "../../../components/LargeTitle";
import { RequireAuth } from "../../../components/RequireAuth";
export default function MenuPage() { return <RequireAuth><LargeTitle>Build a meal</LargeTitle></RequireAuth>; }
