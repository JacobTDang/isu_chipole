import { LargeTitle } from "../../../components/LargeTitle";
import { RequireAuth } from "../../../components/RequireAuth";
export default function MealPage() { return <RequireAuth><LargeTitle>Preset meal</LargeTitle></RequireAuth>; }
