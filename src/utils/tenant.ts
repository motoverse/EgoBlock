import { PAGES } from "../constants.ts/navigation";

export const getWalletAuthURL = (slug: string) => `${window.location.origin}/${slug}/${PAGES.walletAuth}`