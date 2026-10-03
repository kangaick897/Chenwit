import { cache } from "react";

import { siteConfig } from "@/config/site";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SiteContactSettings = typeof siteConfig.contact;

export type PublicSiteSettings = {
  companyName: string;
  contact: SiteContactSettings;
  seo: typeof siteConfig.seo;
  tagline: string;
};

type SiteSettingsRow = {
  company_name: string | null;
  contact: Partial<SiteContactSettings> | null;
  seo: Partial<typeof siteConfig.seo> | null;
  tagline: string | null;
};

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("company_name,tagline,contact,seo")
    .eq("id", "default")
    .maybeSingle();

  if (error || !data) {
    return {
      companyName: siteConfig.companyName,
      contact: siteConfig.contact,
      seo: siteConfig.seo,
      tagline: siteConfig.tagline,
    };
  }

  const settings = data as SiteSettingsRow;

  return {
    companyName: settings.company_name ?? siteConfig.companyName,
    contact: {
      ...siteConfig.contact,
      ...(settings.contact ?? {}),
      businessHours: settings.contact?.businessHours ?? siteConfig.contact.businessHours,
    },
    seo: {
      ...siteConfig.seo,
      ...(settings.seo ?? {}),
    },
    tagline: settings.tagline ?? siteConfig.tagline,
  };
});
