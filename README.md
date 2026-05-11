# Git instruções mais claras

# clonar o repositório

git clone https://github.com/joana-alves04/A-letra.git

# criar branch
git checkout -b [nome da branch]

## dar push na branch
adiciona novas modificações - git add .

podem dizer o que modificaram e tem um btn azul no canto - git commit

dá o push da branch - git push

## listar branch e ver status

git branch

git status

# colocar na main o conteúdo

## primeira opção

mudam da branch para a main - git checkout main

git pull

mudam da main para a branch - git checkout [nome da branch]

git merge main (resolver conflitos no vscode, e corram o projeto para ver se não matou nada)

git push

(ir ao repositorio do github e fazer um pull request da vossa branch para a main e aceitar)

## segunda opção

git checkout main

git pull

git merge [nome da branch]

(resolver conflitos no vscode, e corram o projeto para ver se não matou nada)

git push









# Git & GitHub Quick Start

## One-Time Setup

git config --global user.name "Your Name"

git config --global user.email "your@email.com"

git config --global core.autocrlf true

git config --global init.defaultBranch main

git --version


--------------------------------------------------

# Clone Repository

git clone https://github.com/USERNAME/REPO.git

cd REPO


--------------------------------------------------

# Start Working

# Go to main branch
git checkout main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/my-feature


--------------------------------------------------

# During Development

# Check changes
git status

# Add all files
git add .

# Commit changes
git commit -m "Describe changes"


--------------------------------------------------

# Push to GitHub

# First push
git push -u origin feature/my-feature

# Next pushes
git push


--------------------------------------------------

# After Pull Request Is Merged

# Return to main
git checkout main

# Pull latest changes
git pull origin main

# Delete old branch
git branch -d feature/my-feature


--------------------------------------------------

# Useful Commands

# See branches
git branch

# Switch branch
git checkout branch-name

# Create + switch branch
git checkout -b new-branch

# See commit history
git log --oneline


--------------------------------------------------

# Important Rules

# NEVER work directly on main

# ALWAYS create a branch first

git checkout -b feature/something


# ALWAYS pull before starting work

git pull origin main


# NEVER commit:
.env
API keys
passwords


--------------------------------------------------

# Typical Beginner Flow

git clone REPO_URL

cd REPO

git checkout -b feature/my-feature

# edit files

git add .

git commit -m "Describe changes"

git push -u origin feature/my-feature