export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  isConnected: boolean;
  userAvatar?: string;
  userName?: string;
}

export interface GitCommit {
  id: string;
  sha: string;
  message: string;
  author: string;
  timestamp: number;
  filesChanged: number;
  additions: number;
  deletions: number;
  branch: string;
}

export interface PullRequestDetails {
  title: string;
  body: string;
  headBranch: string;
  baseBranch: string;
  url?: string;
}
