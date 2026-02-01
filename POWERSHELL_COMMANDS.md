# 💻 PowerShell Commands - Quick Reference

## How to Navigate to Your Project Folder

In PowerShell, you need to use `cd` (change directory) to go to a folder.

### ✅ CORRECT Way:
```powershell
cd "C:\Users\eathe\OneDrive\Desktop\Asset-Manager\Asset-Manager-cleaned\Asset-Manager"
```

### ❌ WRONG Way (what you tried):
```
C:\Users\eathe\OneDrive\Desktop\Asset-Manager\Asset-Manager-cleaned\Asset-Manager
```

---

## Step-by-Step: Getting Ready for GitHub

### Step 1: Open PowerShell
- Press `Windows Key + X`
- Click "Windows PowerShell" or "Terminal"
- OR Press `Windows Key + R`, type `powershell`, press Enter

### Step 2: Navigate to Your Project
Copy and paste this command:
```powershell
cd "C:\Users\eathe\OneDrive\Desktop\Asset-Manager\Asset-Manager-cleaned\Asset-Manager"
```

Press Enter. You should see the path change in PowerShell.

### Step 3: Verify You're in the Right Place
Type this to see your files:
```powershell
dir
```

You should see files like:
- `package.json`
- `README.md`
- `BEGINNER_GUIDE.md`
- etc.

---

## Commands You'll Need for GitHub

After you create your GitHub repository (see BEGINNER_GUIDE.md), you'll run these commands:

### 1. Initialize Git (first time only)
```powershell
git init
```

### 2. Add All Files
```powershell
git add .
```

### 3. Commit Files
```powershell
git commit -m "First commit"
```

### 4. Connect to GitHub
```powershell
git remote add origin https://github.com/YOUR-USERNAME/valentine-app.git
```
*(Replace YOUR-USERNAME with your actual GitHub username)*

### 5. Push to GitHub
```powershell
git branch -M main
git push -u origin main
```

---

## Common PowerShell Commands

| Command | What It Does |
|---------|-------------|
| `cd "path"` | Go to a folder |
| `cd ..` | Go up one folder |
| `dir` or `ls` | List files in current folder |
| `pwd` | Show current folder path |
| `cls` | Clear the screen |

---

## Troubleshooting

### Problem: "Cannot find path"
**Solution**: Make sure you use quotes around the path:
```powershell
cd "C:\Users\eathe\OneDrive\Desktop\Asset-Manager\Asset-Manager-cleaned\Asset-Manager"
```

### Problem: "git is not recognized"
**Solution**: You need to install Git first:
1. Go to: https://git-scm.com/download/win
2. Download and install Git for Windows
3. Restart PowerShell after installing

### Problem: "Permission denied"
**Solution**: Make sure you're typing the path correctly with quotes.

---

## Quick Copy-Paste Commands

Here are all the commands you'll need, ready to copy:

```powershell
# Navigate to project
cd "C:\Users\eathe\OneDrive\Desktop\Asset-Manager\Asset-Manager-cleaned\Asset-Manager"

# Check you're in the right place
dir

# Initialize git (if not done already)
git init

# Add all files
git add .

# Commit
git commit -m "First commit"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/valentine-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Need More Help?

- See **BEGINNER_GUIDE.md** for complete step-by-step instructions
- Make sure you've created a GitHub account first
- Make sure you've created a repository on GitHub before running git commands
