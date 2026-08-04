// Festival + foundation identity and the "Supported by" partner logos.
import festival from "@/assets/partners/festival-logo.png.asset.json";
import foundation from "@/assets/partners/foundation-logo.png.asset.json";
import gtdc from "@/assets/partners/gtdc.png.asset.json";
import dac from "@/assets/partners/dac.png.asset.json";
import smartCity from "@/assets/partners/panaji-smart-city.png.asset.json";
import forest from "@/assets/partners/forest.png.asset.json";
import sag from "@/assets/partners/sag.png.asset.json";
import esg from "@/assets/partners/esg.png.asset.json";
import ccp from "@/assets/partners/ccp.png.asset.json";
import goaGovt from "@/assets/partners/goa-govt.png.asset.json";

export const FESTIVAL_LOGO = festival;
export const FOUNDATION_LOGO = foundation;

export type Partner = { name: string; url: string };

export const PARTNERS: Partner[] = [
  { name: "Government of Goa", url: goaGovt.url },
  { name: "Corporation of the City of Panaji", url: ccp.url },
  { name: "Entertainment Society of Goa", url: esg.url },
  { name: "Sports Authority of Goa", url: sag.url },
  { name: "Directorate of Art & Culture, Government of Goa", url: dac.url },
  { name: "Imagine Panaji Smart City Development Ltd.", url: smartCity.url },
  { name: "Goa Forest Department", url: forest.url },
  { name: "Goa Tourism Development Corporation", url: gtdc.url },
];

