export interface Country {
  name: string;
  code: string | null;
  flag: string | null;
  countryID: number;
  countryName: string;
  countryLogo: string;
}

export interface League {
  leagueID: number;
  leagueName: string;
  leagueLogo: string;
  logo: string;
  name: string;
}

export interface Game {
  fixture_id: number;
  home_team: string;
  home_team_logo: string;
  away_team: string;
  away_team_logo: string;
  date: string;
  league_name: string;
  league_logo: string;
}

export interface TeamStats {
  avg_goals: number;
  avg_cards: number;
  avg_corners: number;
  avg_offsides: number;
  avg_fouls: number;
}

export interface Analysis {
  home_team: TeamStats;
  away_team: TeamStats;
  combined: TeamStats;
}
