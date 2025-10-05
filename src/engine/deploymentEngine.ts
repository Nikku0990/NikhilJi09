export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'github-pages' | 'supabase';
  repoUrl?: string;
  branch?: string;
  buildCommand?: string;
  outputDir?: string;
}

export interface DeploymentStatus {
  status: 'idle' | 'preparing' | 'deploying' | 'success' | 'error';
  progress: number;
  message: string;
  url?: string;
  error?: string;
}

export class DeploymentEngine {
  private status: DeploymentStatus = {
    status: 'idle',
    progress: 0,
    message: '',
  };

  private onStatusChange?: (status: DeploymentStatus) => void;

  setStatusCallback(callback: (status: DeploymentStatus) => void) {
    this.onStatusChange = callback;
  }

  async deploy(config: DeploymentConfig, files: { name: string; content: string }[]): Promise<DeploymentStatus> {
    this.updateStatus({
      status: 'preparing',
      progress: 10,
      message: 'Preparing deployment...',
    });

    try {
      switch (config.platform) {
        case 'vercel':
          return await this.deployToVercel(config, files);
        case 'netlify':
          return await this.deployToNetlify(config, files);
        case 'github-pages':
          return await this.deployToGitHubPages(config, files);
        case 'supabase':
          return await this.deployToSupabase(config, files);
        default:
          throw new Error(`Unsupported platform: ${config.platform}`);
      }
    } catch (error: any) {
      this.updateStatus({
        status: 'error',
        progress: 0,
        message: 'Deployment failed',
        error: error.message,
      });
      return this.status;
    }
  }

  private async deployToVercel(
    config: DeploymentConfig,
    files: { name: string; content: string }[]
  ): Promise<DeploymentStatus> {
    this.updateStatus({
      status: 'deploying',
      progress: 30,
      message: 'Deploying to Vercel...',
    });

    try {
      const response = await fetch('/api/deploy/vercel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          config,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();

      this.updateStatus({
        status: 'success',
        progress: 100,
        message: 'Deployed successfully to Vercel',
        url: result.url,
      });

      return this.status;
    } catch (error: any) {
      throw new Error(`Vercel deployment failed: ${error.message}`);
    }
  }

  private async deployToNetlify(
    config: DeploymentConfig,
    files: { name: string; content: string }[]
  ): Promise<DeploymentStatus> {
    this.updateStatus({
      status: 'deploying',
      progress: 30,
      message: 'Deploying to Netlify...',
    });

    try {
      const response = await fetch('/api/deploy/netlify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          config,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();

      this.updateStatus({
        status: 'success',
        progress: 100,
        message: 'Deployed successfully to Netlify',
        url: result.url,
      });

      return this.status;
    } catch (error: any) {
      throw new Error(`Netlify deployment failed: ${error.message}`);
    }
  }

  private async deployToGitHubPages(
    config: DeploymentConfig,
    files: { name: string; content: string }[]
  ): Promise<DeploymentStatus> {
    this.updateStatus({
      status: 'deploying',
      progress: 30,
      message: 'Deploying to GitHub Pages...',
    });

    try {
      const response = await fetch('/api/deploy/github-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          config,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();

      this.updateStatus({
        status: 'success',
        progress: 100,
        message: 'Deployed successfully to GitHub Pages',
        url: result.url,
      });

      return this.status;
    } catch (error: any) {
      throw new Error(`GitHub Pages deployment failed: ${error.message}`);
    }
  }

  private async deployToSupabase(
    config: DeploymentConfig,
    files: { name: string; content: string }[]
  ): Promise<DeploymentStatus> {
    this.updateStatus({
      status: 'deploying',
      progress: 30,
      message: 'Deploying to Supabase...',
    });

    try {
      const edgeFunctions = files.filter((f) => f.name.startsWith('supabase/functions/'));

      if (edgeFunctions.length === 0) {
        throw new Error('No edge functions found to deploy');
      }

      const response = await fetch('/api/deploy/supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: edgeFunctions,
          config,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();

      this.updateStatus({
        status: 'success',
        progress: 100,
        message: 'Deployed successfully to Supabase',
        url: result.url,
      });

      return this.status;
    } catch (error: any) {
      throw new Error(`Supabase deployment failed: ${error.message}`);
    }
  }

  async createGitHubRepo(
    repoName: string,
    files: { name: string; content: string }[],
    token: string
  ): Promise<string> {
    this.updateStatus({
      status: 'preparing',
      progress: 20,
      message: 'Creating GitHub repository...',
    });

    try {
      const response = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repoName,
          files,
          token,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const result = await response.json();
      return result.repoUrl;
    } catch (error: any) {
      throw new Error(`GitHub repo creation failed: ${error.message}`);
    }
  }

  async validateDeploymentConfig(config: DeploymentConfig): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    if (!config.platform) {
      errors.push('Platform is required');
    }

    if (config.platform === 'github-pages' && !config.repoUrl) {
      errors.push('Repository URL is required for GitHub Pages');
    }

    if (config.buildCommand && !config.outputDir) {
      errors.push('Output directory is required when build command is specified');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getStatus(): DeploymentStatus {
    return { ...this.status };
  }

  private updateStatus(updates: Partial<DeploymentStatus>) {
    this.status = { ...this.status, ...updates };

    if (this.onStatusChange) {
      this.onStatusChange(this.status);
    }
  }

  reset() {
    this.status = {
      status: 'idle',
      progress: 0,
      message: '',
    };
    this.onStatusChange?.(this.status);
  }
}

export const deploymentEngine = new DeploymentEngine();
