import {useAuth} from "@/app/context/auth";

export function useAuthHook() {
    return useAuth();
}