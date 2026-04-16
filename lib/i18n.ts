import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export const locales = ["", "pt"];
export const localeNames: any = {
  pt: "Portugues",
};
export const defaultLocale = "pt";

export function getLocale(headers: any): string {
  let languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

const dictionaries: any = {
  pt: () => import("@/locales/pt.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries["pt"]();
};
