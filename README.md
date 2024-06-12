## MYSPOT Application
`Location Central has been renamed to MYSPOT application.`

`MY SPOT` is used to manage data related to parking locations that are managed by SP+.

## Development Commands 

### Install Required Packages
1. Change the directory and point to SP+/Location Central where the package.json file is .

2. Run the below command 

    `npm install --save`

This will create a node_modules folder which has all the required packages needed to run the application.

### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Deployment Notes
### 1. Build the project for production 
     $> cd <<location_of_directory in local>> 
     $> ng build --prod
### 2. Connect to IBM Cloud
	$>bluemix api https://api.ng.bluemix.net
    
### 3. Login with the user account
    $>bluemix login -u <<email>>

### 4. Set Target
    $>bluemix target -o <<org_name>> -s <<space>>
    ex:
     $>bluemix target -o gpearson@spplus.com -s dev

### 5. Push the application
    $> cd <<location_of_directory in local
    $> bluemix app push <<App_Name>>
    ex:
    $>bluemix app push SPPlusLocationUI

## SAML RESPONSE FORMAT
    {
      "issuer": "https://portal.spplus.com/",
      "sessionIndex": "A760924d2",
      "nameID": "IBMDataMart_Admin@spplus.com",
      "nameIDFormat": "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
      "email1": "IBMDataMart_Admin"
    }

## User Security
### Configuration File [Server Side]
server/userSecurity.json

### Working Principle
When the user logs in, the userInfo cookie will transfer the sercurity json to the client, it will use this info while rendering the screens.

### Client Configuration
Each screen should use the directives lcPageSecurity and lcFieldSecurity.

## KNOWN ISSUES
 i. Entitlement Issue: You do not have permission to access this site, Please contact administrator.
    Cause: the angular application has not received an entitlement configuration for this role.
    Solution: 
      a. Assign an appropriate role to the user in location.user_security table [DB].
      b. Check if entitlements for this Role are configured under config/userSecurity.json file.

ii. You do not have permission to navigate to this page.
    Cause: Current user role does not have permission to access the requested page.
## DataMart API's
All the datamart API's are in the DataMart.API . 