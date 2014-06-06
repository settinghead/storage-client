storage-client [![Build Status](http://devtools1.risevision.com:8080/job/Storage-Client-Master-Stage/badge/icon)](http://devtools1.risevision.com:8080/job/Storage-Client-Master-Stage/)
==============

Client-side AngularJS logic for storage project.


First Timer?
----
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

In the "Run Job" view, pick one of the Jenkins builds from the drop-down box, and click "Run Job". The selected build will be deployed to its corresponding server, specified by environment.

Miscellaneous
