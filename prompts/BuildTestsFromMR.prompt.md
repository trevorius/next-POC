# Prepare Task

previous message in this thread will include a merge Request message with a test section.

# Restrictions

- Do not write tests for shadcn/ui components.
- Do not test installed packages
- only test the code that is specific to the project.

# Build Tests

1. analyse the test section and separate tests into groups so they can be automated.
2. analyse the scripts in package.json and identify testing librairies that are used in the project.
3. If there are bettrer suited libraries to install suggest the installation comand. and add a test script to package.json
4. analyse final available scripts in package.json an identify the libraries to use for the tests.
5. write the tests using available libraries for each test in the merge request message.

# run the tests

1. identify test scripts in package.json
2. run the test script.
3. if tests fail :

- fix the code so the test passes
- Do not modify the test unless it doesn't test what it states it should.
- repeat step 2 for the same test script

3. if tests pass :

- move to next test script

4. repeat steps 2-3 until all test scripts pass
