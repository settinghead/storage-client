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
=======
Continuous Deployment
----
### Monitoring CI Builds

The Jenkins CI portal is located at
- [http://devtools1.risevision.com:8080/view/Storage%20Client/](http://devtools1.risevision.com:8080/view/Storage%20Client/)

Three projects are present:
- Storage-Client-PR-Tests, which tests commits to all branches, including forks specificed in the configuration.
- Storage-Client-PR, which builds commits to all branches, including PR's
- Storage-Client-Master-Stage, which builds all commits to the master and generate a distrubiton(or artifact) specific to production environment
- Storage-Client-Master-Prod, which builds all commits to the master and generate a distrubiton(or artifact) specific to staging environment

### Manual Deploy to Production and Staging Server

Open Rundeck via the following address:
- [http://devtools1.risevision.com:4440/project/rv-storage/jobs](http://devtools1.risevision.com:4440/project/rv-storage/jobs)

Credentials: admin/admin

Click on one of the tasks:
- Deploy to FTP - Production
- Deploy to FTp - Staging
=======

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/. 
