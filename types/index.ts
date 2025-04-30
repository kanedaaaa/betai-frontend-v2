export interface Country {
  name: string;
  code: string | null;
  flag: string | null;
}

export interface League {
  name: string;
  leagueID: number;
  logo: string;
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
