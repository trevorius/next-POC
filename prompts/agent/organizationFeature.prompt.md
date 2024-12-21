# Organization feature

lets add a feature for super admin user to create an organisation and an account for the organisation owner.

## requirements

- use server actions as much as possible and use query parameters to manage state if possible allowing for a maximium of static elements in the page and fast rendering.

- TDD approach for the new feature. writing tests first and then the code.

- protect all superadmin routes and actions behind a /superadmin/\*\* route

## UI

- use the new sidebar from shadcn/ui.
- limit dialog interface usage to end actions and confirmations.
- build reusable components for future usage if possible.
- use the new dialog component from shadcn/ui.

## Back end

- use existing tables and relationships. as much as possible.
- protect all superadmin routes and actions behind a /superadmin/** or api/superadmin/** routes with nextjs middleware feature.
- structure server side code into server action service files to be used by the UI or API routes
- avoid API routes if possible.

## expected minimum tests

these are a minimum of tests expected for this feature but not all tests are listed here.

- sidebar element should only be rendered for superadmin users.
- routes should be protected and only accessible to superadmin users.
- server actions should be protected and only accessible to superadmin users.

<hr/>

# Follow up prompts:

## delete button:

add a delete button to organizations tabel to remove organizations this will require a confirmation dialog don't forget superadmin routes must be protected as is configured in the middleware file.

use server actions as much as possible for code to be easyer to follow.

use TDD principles writing failing tests BEFORE ANYTHING ELSE
and then writing the code to mmake the tests pass.
test both server actions and ui
