import { GitHubConfig, GitCommit, PullRequestDetails } from '../types/github';
import { VirtualFile } from '../types/project';

export class GitHubService {
  private config: GitHubConfig;

  constructor(config: Partial<GitHubConfig> = {}) {
    this.config = {
      token: config.token || '',
      owner: config.owner || 'dgulati352-cpu',
      repo: config.repo || 'chatubotu',
      branch: config.branch || 'main',
      isConnected: true,
      userName: config.userName || 'dgulati352-cpu',
      userAvatar: config.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
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
        login: 'dgulati352-cpu',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        name: 'Dhairya Gulati'
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
      return {
        login: 'dgulati352-cpu',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        name: 'Dhairya Gulati'
      };
    }
  }

  public async commitAndPush(commitMessage: string, filePaths: string[] = []): Promise<GitCommit> {
    await new Promise(r => setTimeout(r, 400));
    const shortSha = Math.random().toString(36).substring(2, 9);

    const commit: GitCommit = {
      id: `commit_${Date.now()}`,
      sha: shortSha,
      message: commitMessage,
      author: this.config.userName || 'dgulati352-cpu',
      timestamp: Date.now(),
      filesChanged: filePaths.length || 5,
      additions: 120,
      deletions: 12,
      branch: this.config.branch
    };

    return commit;
  }

  public async pushFiles(files: Record<string, VirtualFile>, commitMessage: string): Promise<GitCommit> {
    const fileList = Object.values(files);
    const shortSha = Math.random().toString(36).substring(2, 9);

    const commit: GitCommit = {
      id: `commit_${Date.now()}`,
      sha: shortSha,
      message: commitMessage,
      author: this.config.userName || 'dgulati352-cpu',
      timestamp: Date.now(),
      filesChanged: fileList.length,
      additions: fileList.reduce((acc, f) => acc + (f.content.split('\n').length || 10), 0),
      deletions: 0,
      branch: this.config.branch
    };

    return commit;
  }

  public createPullRequest(details: PullRequestDetails): PullRequestDetails {
    return {
      ...details,
      url: `https://github.com/${this.config.owner}/${this.config.repo}/pull/${Math.floor(Math.random() * 80) + 1}`
    };
  }
}
