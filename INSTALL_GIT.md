# 🔧 Install Git on Windows (Quick Guide)

You're getting the error `git is not recognized` because Git isn't installed yet. Here's how to fix it:

---

## Option 1: Install Git (For Command Line)

### Step 1: Download Git
1. Go to: **https://git-scm.com/download/win**
2. Click the download button (it will download automatically)
3. The file will be called something like `Git-2.xx.x-64-bit.exe`

### Step 2: Install Git
1. **Double-click** the downloaded file
2. Click **"Next"** through all the installation screens
3. **Keep all the default options** (just keep clicking Next)
4. Click **"Install"**
5. Wait for it to finish (takes 1-2 minutes)
6. Click **"Finish"**

### Step 3: Restart PowerShell
1. **Close** your current PowerShell window
2. **Open a new PowerShell** window
   - Press `Windows Key + R`
   - Type: `powershell`
   - Press Enter

### Step 4: Test Git
Type this in PowerShell:
```powershell
git --version
```

If you see something like `git version 2.xx.x`, it worked! ✅

### Step 5: Go Back to Your Project
```powershell
cd "C:\Users\eathe\OneDrive\Desktop\Asset-Manager\Asset-Manager-cleaned\Asset-Manager"
```

### Step 6: Now Run Your Git Commands
```powershell
git init
git add .
git commit -m "First commit"
git remote add origin https://github.com/eathenbaby/valentine.git
git branch -M main
git push -u origin main
```

---

## Option 2: Use GitHub Desktop (EASIER - Recommended!)

If you don't want to deal with command line, use GitHub Desktop instead. It's much easier!

### Step 1: Download GitHub Desktop
1. Go to: **https://desktop.github.com**
2. Click **"Download for Windows"**
3. The file will download automatically

### Step 2: Install GitHub Desktop
1. **Double-click** the downloaded file
2. Follow the installation (just click Next/Install)
3. Open GitHub Desktop when it's done

### Step 3: Sign In
1. Sign in with your GitHub account (eathenbaby)
2. Authorize GitHub Desktop

### Step 4: Add Your Project
1. In GitHub Desktop, click **"File"** → **"Add Local Repository"**
2. Click **"Choose..."**
3. Navigate to: `C:\Users\eathe\OneDrive\Desktop\Asset-Manager\Asset-Manager-cleaned\Asset-Manager`
4. Click **"Add repository"**

### Step 5: Publish to GitHub
1. Click **"Publish repository"** button (top right)
2. Make sure the name is: `valentine`
3. Make sure it says: `eathenbaby/valentine`
4. **Uncheck** "Keep this code private" (if you want it public)
5. Click **"Publish repository"**

**Done!** ✅ Your code is now on GitHub!

---

## Which Option Should I Choose?

### Choose Option 1 (Install Git) if:
- You want to learn command line
- You're comfortable with technical stuff
- You want more control

### Choose Option 2 (GitHub Desktop) if:
- You want the easiest way
- You don't like command line
- You just want to get it done quickly

**For beginners, I recommend Option 2 (GitHub Desktop)!**

---

## After You're Done

Once your code is on GitHub (using either method), go back to **BEGINNER_GUIDE.md** and continue with **Step 3: Deploy on Railway**.

---

## Troubleshooting

### Problem: "Git is still not recognized" after installing
**Solution**: 
1. Close ALL PowerShell windows
2. Open a NEW PowerShell window
3. Try `git --version` again

### Problem: GitHub Desktop won't find my folder
**Solution**: 
- Make sure you're selecting the `Asset-Manager` folder (the one with `package.json` inside)

### Problem: "Repository already exists" error
**Solution**: 
- Your repository `eathenbaby/valentine` already exists on GitHub
- That's okay! Just make sure you're connected to it
- In GitHub Desktop, it should show your repository

---

## Quick Summary

**Easiest Path:**
1. Download GitHub Desktop: https://desktop.github.com
2. Install it
3. Add your project folder
4. Click "Publish repository"
5. Done! ✅

**Command Line Path:**
1. Download Git: https://git-scm.com/download/win
2. Install it
3. Restart PowerShell
4. Run the git commands
5. Done! ✅
