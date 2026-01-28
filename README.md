# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

  //START SERVER
### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm install -g serve`
//install node server for host application
//npm install -g serve

//start node server from the building folder build
### `serve -s build`


### IIS (Internet Information Services)
🔹 Method 1: Install IIS via Windows Features (GUI)

Open Windows Features

Press Win + R, type:

optionalfeatures


and press Enter.

Enable IIS

In the Windows Features dialog, look for Internet Information Services.

Check the box next to it.

Expand it and select additional features you want, such as:

Web Management Tools → IIS Management Console

World Wide Web Services → Application Development Features (ASP.NET, CGI, etc. if needed)

Click OK

Windows will install IIS components.

Restart your PC if prompted.

Verify Installation

Open a browser and go to:

http://localhost


If IIS is installed, you’ll see the IIS Welcome Page.

🔹 Method 2: Install IIS via PowerShell (Quick)

Open PowerShell as Administrator.

Run this command:

Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole -All


Wait until installation completes, then restart your computer.

Test by visiting:

http://localhost

🔹 IIS Default Path & Port

Default website root folder:

C:\inetpub\wwwroot


Default port: 80



testing
✅ Step 1: Verify IIS is Running

Open your browser and type:

http://localhost


If IIS is working, you should see the IIS default welcome page.
✅ Step 2: Open IIS Manager
Press Win + S, type:
IIS Manager
or
inetmgr
and press Enter.
The IIS Manager console will open. From here, you can configure sites, bindings, and application pools.

✅ Step 3: Default Website Location
By default, IIS serves files from:
C:\inetpub\wwwroot
Place your index.html or app files in this folder.
Refresh http://localhost and you’ll see your content instead of the IIS welcome page.

✅ Step 4: Create Your Own Website
In IIS Manager, right-click Sites → Add Website.
Enter:
Site name: e.g., MyApp
Physical path: folder where your project is located
Binding: Keep http, IP All Unassigned, port 80 (or another if port 80 is busy).
Click OK → Your site is now running.

✅ Step 5: Test Your Site
Open browser → go to:
http://localhost
or
http://127.0.0.1
If you added a new site on a custom port (say 8080), access it via:
http://localhost:8080

then install IIS URL Rewrite Module
https://www.iis.net/downloads/microsoft/url-rewrite

resert server
 
 iisreset



C:\Windows\System32\cmd.exe 
cd "C:\Users\Eng VarTrick\Documents\GitHub\Job_card_management"

