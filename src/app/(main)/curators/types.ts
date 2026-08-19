export interface CuratorDiscipline {
  id: number;
  slug: string;
  name: string;
}

export interface CuratorListItem {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  curator_image: string | null;
  discipline: CuratorDiscipline | null;
}

export interface CuratorDetail extends CuratorListItem {
  bio: string | null;
  instagram_link: string | null;
  instagram_handle: string | null;
}

export interface CuratorProgram {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  } | null;
  program_details: Array<{
    event_date: string | null;
  }>;
}

export interface CuratorDetailData {
  curator: CuratorDetail;
  programs: CuratorProgram[];
}

export type CuratorDisciplineFilter = "all" | number;
