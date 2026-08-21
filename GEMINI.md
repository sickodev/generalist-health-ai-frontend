# Frontend Project Rules & Workflow Guidelines

## Git Branching & Commit Conventions

For every task executed on this codebase:

1. **Branch Naming**:
   - Before coding or making changes for any task, create and check out a dedicated branch named:
     `feature/task-F<number>`
     *(e.g., `feature/task-F1`, `feature/task-F8`, etc.)*

2. **Commit Message Format**:
   - Every commit must adhere to the format:
     `F<number>:<message changes>`
     *(e.g., `F1:install angular material and configure environments`, `F3:add indexeddb auth and polling service`)*

3. **Execution Protocol**:
   - Only code or modify files when specifically instructed by the user.
   - Run `npm run build` to verify compilation before committing.
