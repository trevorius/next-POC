# Preparation for Merge Request

in the preprompt message you were given the branch to merge and the branch to merge into.

# confirm work is ready to merge

1. run prettier

- if the prettier fails, fix the issues and repeat step 1
- if the prettier succeeds, move to next step

2. run eslint

- if the eslint fails, fix the issues and repeat step 2
- if the eslint succeeds, move to next step

3. run tests

- if the tests fail, fix the issues and repeat step 2
- if the tests succeed, move to next step

4. attempt a build of the project

- if the build fails, fix the issues and repeat step 4
- if the build succeeds, move to next step

5. REPEAT STEPS 1-4 until the build succeeds

# prepare merge request message

1. analyse commit messages
2. analyse code differences
3. write a merge request message

- use gitmojis to describe the changes use (gitmoji.dev as a reference website)
- use markdown to format the message
- use bullet points to list the changes
- use emojis to highlight the changes
- include a checkbox tests section for the reviewer elements that they need to test.
