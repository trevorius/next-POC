# Commit Sequence for work that has been done

there is a long list of changes that need to be committed.

# Commit Work Organization System

## Commit Categories (Priority Order)

1. AI/Prompt Files
2. Test Files
3. Server Actions
4. API Routes
5. Services
6. Public Assets
7. Styles
8. Types/Interfaces
9. UI Components
10. Layout Components
11. Pages
12. App Router Files
13. Utils
14. Documentation
15. Miscellaneous

## work sequence

1. call git status to see the changed files. analyse witch files fit in which category.
2. add AI/prompt files
3. build commit message
4. commit the changes
5. locate test file for a change
6. add test file
7. build commit message
8. commit the changes
9. locate tested file from previous commit
10. add tested file
11. build commit message
12. commit the changes
13. repeat for the next file
    **once all tests have been committed**
14. move to next category
15. add a file for the current category. (starting with prompt or Ai files)
16. analyse the changes in the files for commit message.
17. build the commit message: use gitmoji and a short description of the changes. maximum 100 characters.
18. commit the changes.
19. repeat for the next file in the category.
20. repeat for the next category.

## Gitmoji Category Guide

### schema for message and gitmoji examples

<gitmoji> <type>(<scope>): <description>

reference : https://gitmoji.dev/
Example:
✨ feat(auth): Add OAuth login support

### Feature Development

- ✨ `:sparkles:` - New feature
- 🚧 `:construction:` - Work in progress
- ⚡️ `:zap:` - Performance improvement

### Testing

- ✅ `:white_check_mark:` - Add/update tests
- 🧪 `:test_tube:` - Add failing tests
- 🔨 `:hammer:` - Fix tests

### Code Quality

- ♻️ `:recycle:` - Refactor code
- 🎨 `:art:` - Improve structure/format
- 💡 `:bulb:` - Add/update comments

### Bug Fixes

- 🐛 `:bug:` - Fix a bug
- 🚑️ `:ambulance:` - Critical hotfix
- 🥅 `:goal_net:` - Error handling

### Documentation

- 📝 `:memo:` - Documentation updates
- 💬 `:speech_balloon:` - Update text/literals

### Database

- 🗃️ `:card_file_box:` - Database changes
- 🌱 `:seedling:` - Add/update seed files

### UI/UX

- 💄 `:lipstick:` - UI/style updates
- 💫 `:dizzy:` - Animations/transitions
- ♿️ `:wheelchair:` - Accessibility

### Dependencies

- ➕ `:heavy_plus_sign:` - Add dependency
- ➖ `:heavy_minus_sign:` - Remove dependency
- ⬆️ `:arrow_up:` - Upgrade dependencies

### Configuration

- 🔧 `:wrench:` - Config files
- 🔒️ `:lock:` - Security updates
- 🚨 `:rotating_light:` - Fix linter warnings

### Cleanup

- 🔥 `:fire:` - Remove code/files
- 🗑️ `:wastebasket:` - Deprecate code
- ⚰️ `:coffin:` - Dead code removal
