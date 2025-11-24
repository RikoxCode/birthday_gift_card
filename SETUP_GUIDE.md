# 🚀 Quick Setup Guide for GHCR Workflow

## 📋 Prerequisites Checklist

- ✅ GitHub repository
- ✅ Dockerfile in your repo (already done!)
- ✅ GitHub account with package permissions

## 🔧 Setup Steps

### 1. **Enable GitHub Container Registry**
1. Go to your GitHub profile → **Settings**
2. Navigate to **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Create a token with `write:packages` permission (if you need personal access)

### 2. **Repository Settings**
1. Go to your repository → **Settings** → **Actions** → **General**
2. Make sure **"Allow GitHub Actions to create and approve pull requests"** is enabled
3. Under **Workflow permissions**, select **"Read and write permissions"**

### 3. **Test the Workflow**

#### **Option A: Push to main branch**
```bash
git add .github/
git commit -m "Add Docker build workflow"
git push origin main
```

#### **Option B: Manual trigger**
1. Go to **Actions** tab in your GitHub repo
2. Select **"Build & Push to GHCR"**
3. Click **"Run workflow"**
4. Choose branch and optionally add a custom tag
5. Click **"Run workflow"**

### 4. **Monitor the Build**
1. Go to **Actions** tab
2. Click on the running workflow
3. Watch the real-time logs
4. Check for any errors

### 5. **Verify the Container**
After successful build, your container will be available at:
```
ghcr.io/[your-username]/[repo-name]:latest
```

Example:
```bash
# Pull the image
docker pull ghcr.io/rikoxcode/rahel_birthday:latest

# Run the container
docker run -p 8080:80 ghcr.io/rikoxcode/rahel_birthday:latest
```

## 🐛 Troubleshooting

### **Common Issues:**

#### **❌ Permission denied**
```
Error: buildx failed with: error: failed to solve: failed to push ...
```
**Solution:** Check repository permissions in Settings → Actions → General

#### **❌ Authentication failed**
```
Error: failed to authorize: failed to fetch oauth token
```
**Solution:** Make sure `GITHUB_TOKEN` has package write permissions

#### **❌ Dockerfile not found**
```
Error: failed to solve: failed to read dockerfile
```
**Solution:** Make sure Dockerfile is in the repository root

#### **❌ Build context issues**
```
Error: failed to solve: failed to compute cache key
```
**Solution:** Check that all COPY paths in Dockerfile exist

## 🎯 What Happens When You Push?

1. **Trigger**: Workflow starts on push to main
2. **Checkout**: Downloads your repository code
3. **Setup**: Configures Docker Buildx for multi-platform builds
4. **Login**: Authenticates with GitHub Container Registry
5. **Build**: Builds your Docker image for AMD64 and ARM64
6. **Push**: Pushes the image to GHCR
7. **Tag**: Tags with branch name, SHA, and "latest"

## 🏷️ Image Tags Created

Your workflow will create multiple tags:
- `latest` (for main branch)
- `main` (branch name)
- `sha-abc1234` (git commit SHA)
- Custom tags (if manually triggered)

## 📦 Using Your Published Image

### **In Production**
```bash
docker pull ghcr.io/your-username/your-repo:latest
docker run -d -p 80:80 ghcr.io/your-username/your-repo:latest
```

### **In Docker Compose**
```yaml
version: '3.8'
services:
  app:
    image: ghcr.io/your-username/your-repo:latest
    ports:
      - "8080:80"
```

### **In Kubernetes**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: angular-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: angular-app
  template:
    metadata:
      labels:
        app: angular-app
    spec:
      containers:
      - name: app
        image: ghcr.io/your-username/your-repo:latest
        ports:
        - containerPort: 80
```

## 🎉 Success!

After following these steps, every push to your main branch will:
1. Build a fresh Docker image
2. Push it to GitHub Container Registry
3. Make it available for deployment anywhere!

**Happy automating!** 🚀