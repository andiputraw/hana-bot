export type HeroStats = {
  element: string;
  teamBuff: string;
  introduced?: string;
};

export type HeroAbilities = {
  normalAtk: string;

  chainSkill: {
    alignment: string;
    desc: string;
  };

  specialAbility: string;

  exWp: string;
};

export type HeroMetadata = {
  seeAlso?: string;
};

export type CacheType = "hero";
export type DocumentType = "info" | "desc" | "thumbnail";
