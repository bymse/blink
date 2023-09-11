import {redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect";

export default async function Home() {
    redirect('/connect', RedirectType.replace);
}