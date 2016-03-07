#Stylekit
<img align="center" src="https://stash.evisions.com/projects/LAB/repos/stylekit/browse/stylekit-logo.png?at=master&raw" alt="StyleKit" width="250">

####_Warning_: This project is currently setup only for the IRB product, so try to avoid any adding any overrides within the irb/ folder, instead add them to the company theme overrides.

Adding a New Component Checklist
--------------------------------
####Creating the component definition
- Decide on the component type, between __views__, __collections__, __elements__, or __modules__
- Create the .less definition file within `semantic/src/definitions/{{type}}/{{component}}.less`
- Within the definition file, include the following:

```
/*******************************
            Theme
*******************************/

/* Define type and element to help locate theme files */
@type    : 'element';
@element : 'button';

/* Processes Variable Inheritance */
@import (multiple) '../../theme.config';

/* Create scope */
& {

/*******************************
           Button
*******************************/

/* Define Component */
.ui.button {
}

/* Load CSS Overrides and Inline */
.loadUIOverrides();

}
```

###Adding a default theme
- Within the `semantic/src/theme.config` file, add the variable for your new component to reference the default theme, for instance:

```
@button     : 'default';
```

- Create a .variable and .override file in `semantic/src/theme/default/{{type}}/`

###Adding the Evisions theme
- Within the `./theme.config` file, add the variable for your new component to reference the default evisions theme, for instance:

```
@button     : 'evisions';
```

- Create a .variable and .override file in `themes/evisions/{{type}}/`

###Adding the site specific overrides
- Create a .variable and .override file in `semantic/src/_site/{{type}}/`

###Adding the app specific overrides
- Create a .variable and .override file in `apps/irb/{{type}}/`


Building and Releasing
----------------------
####Simplifying release process
- This method simplifies the release process and avoids merge conflicts
- Don't commit the `dist/` files
- Stop your grunt dev process from running
- Reset any build files
- Pull any changes and reset the build files again
- Run `grunt release`, to build your files and push to master

[Semantic UI Reference](http://semantic-ui.com/usage/theming.html)