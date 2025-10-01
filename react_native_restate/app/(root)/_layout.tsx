import {useGlobalContext} from "@/lib/global-provider";
import {Slot, Redirect} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator} from "react-native";


export default function AppLayout() {

    const { loading, isLoggedIn } = useGlobalContext();

    if(loading) {
        return (
            <SafeAreaView className="bg-white flex h-full justify-center items-center">
                <ActivityIndicator  className="text-primary-300" size="large"/>
            </SafeAreaView>
        )
    }

    if(!isLoggedIn) return <Redirect href="/sign-in" />

    return <Slot />
}