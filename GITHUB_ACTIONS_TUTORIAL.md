# 🎯 GitHub Actions & Workflows - Complete Tutorial

## 🤔 What are GitHub Actions?

GitHub Actions is a CI/CD platform that allows you to automate your software development workflows directly in your GitHub repository. Think of it as your personal robot that can:

- 🏗️ Build your code
- 🧪 Run tests
- 🚀 Deploy applications
- 📦 Publish packages
- 🔄 And much more!

## 📁 Workflow Structure

```
.github/
└── workflows/
    ├── docker-build-push.yml    # Our Docker workflow
    ├── tests.yml                # Testing workflow
    └── deploy.yml               # Deployment workflow
```

## 🔧 Anatomy of a Workflow

### 1. **Basic Structure**
```yaml
name: 'My Workflow'           # Workflow name (shows in GitHub UI)

on:                           # When to trigger
  push:
    branches: [ main ]

jobs:                         # What to do
  my-job:
    runs-on: ubuntu-latest    # What OS to use
    steps:                    # List of actions
      - name: 'Step 1'
        run: echo "Hello World!"
```

### 2. **Triggers (`on`)**
```yaml
on:
  # On every push to main
  push:
    branches: [ main ]
  
  # On pull requests
  pull_request:
    branches: [ main ]
  
  # On schedule (cron syntax)
  schedule:
    - cron: '0 2 * * *'  # Every day at 2 AM
  
  # Manual trigger
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
```

### 3. **Jobs & Steps**
```yaml
jobs:
  # Job 1
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm run build
  
  # Job 2 (runs after build succeeds)
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
  
  # Job 3 (runs in parallel with others)
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
```

## 🌍 Environment Variables & Secrets

### **Environment Variables**
```yaml
env:
  # Global variables (available to all jobs)
  NODE_VERSION: '18'
  REGISTRY: ghcr.io

jobs:
  build:
    env:
      # Job-specific variables
      BUILD_ENV: production
    steps:
      - name: 'Use Variables'
        env:
          # Step-specific variables
          CUSTOM_VAR: 'Hello'
        run: |
          echo "Node version: $NODE_VERSION"
          echo "Registry: $REGISTRY"
          echo "Build env: $BUILD_ENV"
          echo "Custom: $CUSTOM_VAR"
```

### **GitHub Secrets** 🔒
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secrets like:
   - `DOCKER_HUB_TOKEN`
   - `DATABASE_PASSWORD`
   - `API_KEY`

```yaml
steps:
  - name: 'Use Secret'
    run: echo "Secret value: ${{ secrets.MY_SECRET }}"
```

## 🏃 Runner Types

```yaml
jobs:
  # GitHub-hosted runners (free tier)
  ubuntu-job:
    runs-on: ubuntu-latest      # Ubuntu 22.04
    
  windows-job:
    runs-on: windows-latest     # Windows Server 2022
    
  macos-job:
    runs-on: macos-latest       # macOS 12
    
  # Specific versions
  specific-version:
    runs-on: ubuntu-20.04
    
  # Self-hosted runners
  self-hosted:
    runs-on: self-hosted
```

## 🔄 Common Actions (Pre-built Actions)

```yaml
steps:
  # Checkout code
  - uses: actions/checkout@v4
  
  # Setup Node.js
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
      cache: 'npm'
  
  # Setup Python
  - uses: actions/setup-python@v4
    with:
      python-version: '3.9'
  
  # Cache dependencies
  - uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
  
  # Upload artifacts
  - uses: actions/upload-artifact@v3
    with:
      name: build-files
      path: dist/
  
  # Download artifacts
  - uses: actions/download-artifact@v3
    with:
      name: build-files
```

## 🐳 Docker-Specific Actions

```yaml
steps:
  # Setup Docker Buildx
  - uses: docker/setup-buildx-action@v3
  
  # Login to registries
  - uses: docker/login-action@v3
    with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}
  
  # Build and push
  - uses: docker/build-push-action@v5
    with:
      context: .
      push: true
      tags: user/app:latest
      platforms: linux/amd64,linux/arm64
```

## 📊 Advanced Features

### **Matrix Builds** (Test Multiple Versions)
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

### **Conditional Steps**
```yaml
steps:
  - name: 'Only on main branch'
    if: github.ref == 'refs/heads/main'
    run: echo "This is main!"
    
  - name: 'Only on success'
    if: success()
    run: echo "Previous steps succeeded"
    
  - name: 'Only on failure'
    if: failure()
    run: echo "Something failed"
    
  - name: 'Always run'
    if: always()
    run: echo "This always runs"
```

### **Outputs & Sharing Data**
```yaml
jobs:
  build:
    outputs:
      version: ${{ steps.version.outputs.value }}
    steps:
      - id: version
        run: echo "value=v1.0.0" >> $GITHUB_OUTPUT
        
  deploy:
    needs: build
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

## 🎯 Best Practices

### ✅ **Do's**
- Use specific action versions: `actions/checkout@v4`
- Store secrets in GitHub Secrets, not in code
- Use descriptive names for jobs and steps
- Cache dependencies when possible
- Use matrix builds for testing multiple environments
- Pin Docker image versions in your Dockerfile

### ❌ **Don'ts**
- Don't commit secrets to your repository
- Don't use `runs-on: ubuntu-latest` for production (use specific versions)
- Don't make workflows too complex (split into multiple files)
- Don't ignore security scanning results

## 🛡️ Security Tips

```yaml
jobs:
  secure-job:
    runs-on: ubuntu-latest
    permissions:
      contents: read      # Only read repository contents
      packages: write     # Write to package registry
      # Don't give unnecessary permissions
    steps:
      - uses: actions/checkout@v4
      # Always use specific versions, not @main or @latest
```

## 🔍 Debugging Workflows

### **Enable Debug Logging**
Add these secrets to your repo:
- `ACTIONS_RUNNER_DEBUG: true`
- `ACTIONS_STEP_DEBUG: true`

### **Common Issues & Solutions**

1. **Permission Denied**
   ```yaml
   permissions:
     contents: read
     packages: write  # Add this for GHCR
   ```

2. **Authentication Failed**
   ```yaml
   - uses: docker/login-action@v3
     with:
       registry: ghcr.io
       username: ${{ github.actor }}
       password: ${{ secrets.GITHUB_TOKEN }}  # Use GITHUB_TOKEN, not PAT
   ```

3. **Build Context Issues**
   ```yaml
   - uses: docker/build-push-action@v5
     with:
       context: .          # Use current directory
       file: ./Dockerfile  # Specify Dockerfile location
   ```

## 📈 Monitoring & Notifications

### **Slack Notifications**
```yaml
- name: 'Notify Slack'
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### **Email Notifications**
GitHub automatically sends emails on workflow failures to the person who triggered it.

## 🎪 Example Workflows

### **Basic CI/CD**
```yaml
name: CI/CD
on:
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      
  build-and-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - name: Deploy
        run: echo "Deploying to production!"
```

## 🚀 Next Steps

1. **Start Simple**: Create a basic workflow that just runs `echo "Hello World"`
2. **Add Testing**: Include your test commands
3. **Add Building**: Build your application
4. **Add Deployment**: Deploy to your target environment
5. **Optimize**: Add caching, parallel jobs, and advanced features

## 📚 Useful Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

🎉 **You're now ready to automate everything with GitHub Actions!** Start with our Docker workflow and expand from there!