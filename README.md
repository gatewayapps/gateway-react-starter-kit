# jobbook
Key features we want to support:

 - Organizations
 - Projects
 - Customers
 - Miscellaneous



##Organizations##
Organization support is critical in allowing us to monetize Jobbook.  We should support a user/month based billing scheme as well as a free trial.

Organizations should be able to access the jobbook via subdomains - gateway.jobbook.io or nucor.jobbook.io - on a first come/first serve basis.

We will also support Organization level integrations so users are not required to add their credentials for third party integrations.

##Projects##
Projects will see a number of improvements compared to the current Jobbook.

1.  Custom field support - instead of trying to make a one-size fits all Project, we will have a base project that customers can add custom fields to.  The custom fields will allow a few different data types: Text, Date/Time, Boolean, Numeric - any other types are beyond the scope of v1.
2. Third party integrations - allow projects to be tied to things like Github repos, Basecamp projects, Asana projects, etc...  This would synchronize tasks - If you complete a task in the jobbook, it would update on Github and visa versa.
3. Time entry - instead of having a secondary website for entering time, we would have it built directly into the jobook.  Projects could optionally require that all time charged to a project have a task associated with it.
4. Reporting - Automatic reporting of progress/time accrued on a project could be configured to send on a schedule.
5. Attachments - attachments can be directly uploaded or linked to Onedrive/Dropbox/Box/iCloud/Google Drive files
6. Tasks - Critical component of Projects in our next release.  Tasks and Milestones should be integrated with a project.  These should synchronize with Basecamp/Github/Asana/Etc...
7. Multiple POs - support ability to add multiple PO numbers and tie those to invoices

##Customers##
Customers are going to be a key concept for the next version of Jobbook

1.  Customers will become a first party component.  Customers will have their own page for tracking leads, projects, invoices, and contacts.
2. A landing page for a customer should be able to provide details about outstanding invoices.
3. The customer page should have a way to view tasks by project
3. Customers will have owners - these will be salespeople/contact people for those customers.  By default, they will receive updates for activity on projects belonging to those customers.

##Miscellaneous##
Some other ideas worth exploring

 - Setting employee cost per hour for profit/loss analysis
 - Ability to send emails from the software to track replies
 - Status rules for projects - generate the project status based on values in the project
 - Integrated feedback - take feedback from users and log them for future reference

