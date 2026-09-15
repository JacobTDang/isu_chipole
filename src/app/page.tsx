import { LargeTitle } from "../components/LargeTitle";
import { RequireAuth } from "../components/RequireAuth";

export default function Home() {
  return <RequireAuth><LargeTitle>Home</LargeTitle></RequireAuth>;
}
