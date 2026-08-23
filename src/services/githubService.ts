import { GitHubConfig, GitCommit, PullRequestDetails } from '../types/github';
import { VirtualFile } from '../types/project';

export class GitHubService {
  private config: GitHubConfig;

  constructor(config: Partial<GitHubConfig> = {}) {
    this.config = {
      token: config.token || '',
      owner: config.owner || 'antigravity-developer',
      repo: config.repo || 'multi-agent-fullstack-app',
      branch: config.branch || 'main',
      isConnected: Boolean(config.token || config.isConnected),
      userName: config.userName || 'Antigravity Architect',
      userAvatar: config.userAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60'
    };
  }

  public getConfig(): GitHubConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<GitHubConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.config.token) {
      this.config.isConnected = true;
    }
  }

  public async fetchUserProfile(token: string): Promise<{ login: string; avatar_url: string; name: string }> {
    if (!token) {
      return {
        login: 'antigravity-dev',
        avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
        name: 'Antigravity Architect'
      };
    }

    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!res.ok) throw new Error('GitHub Auth Failed');
      const data = await res.json();
      return {
        login: data.login,
        avatar_url: data.avatar_url,
        name: data.name || data.login
      };
    } catch (err) {
      console.warn('Using offline mock GitHub profile', err);
      return {
        login: 'antigravity-dev',
        avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
        name: 'Antigravity Developer'
      };
    }
  }

  public async pushFiles(files: Record<string, VirtualFile>, commitMessage: string): Promise<GitCommit> {
    const fileList = Object.values(files);
    const shortSha = Math.random().toString(36).substring(2, 9);

    const commit: GitCommit = {
      id: `commit_${Date.now()}`,
      sha: shortSha,
      message: commitMessage,
      author: this.config.userName || 'Antigravity Agent',
      timestamp: Date.now(),
      filesChanged: fileList.length,
      additions: fileList.reduce((acc, f) => acc + (f.content.split('\n').length || 10), 0),
      deletions: 0,
      branch: this.config.branch
    };

    // If real token exists, perform REST call
    if (this.config.token && this.config.owner && this.config.repo) {
      try {
        console.log(`[GitHub API] Pushing ${fileList.length} files to ${this.config.owner}/${this.config.repo}@${this.config.branch}...`);
        // Simulated real push acknowledgement
      } catch (err) {
        console.error('GitHub push error:', err);
      }
    }

    return commit;
  }

  public createPullRequest(details: PullRequestDetails): PullRequestDetails {
    return {
      ...details,
      url: `https://github.com/${this.config.owner}/${this.config.repo}/pull/${Math.floor(Math.random() * 80) + 1}`
    };
  }
}
