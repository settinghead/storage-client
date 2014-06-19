###Storage Client  ![Build Status](http://devtools1.risevision.com:8080/job/Storage-Client-BranchPush/badge/icon)

**Copyright © 2010 - May 2014 Rise Vision Incorporated.**

*Use of this software is governed by the GPLv3 license (available in the LICENSE file).*

Storage client is the client side application for the storage server.  Together they make up the storage module which is part of the [RVA](http://rva.risevision.com) digital signage management application.  


[RVA](http://rva.risevision.com) runs on Google App Engine and as such requires GAE to operate. It also uses Google Cloud Storage as a datastore.

Storage Client Usage
====================

* Checkout the project from git repository.
* run
```bash
npm run dev-install # install dependencies
npm run dev         # run static server on port 8000 & open default web browser
```

Testing
----

For unit testing (with file watching), run

```bash
gulp test
```

To run unit test for a single run, do
```bash
gulp test-ci
```

To run E2E testing, do
```bash
gulp test-e2e
```

-----------
If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/. 
