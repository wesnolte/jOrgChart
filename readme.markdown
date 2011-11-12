#Readme


##Overview

Follow me [@wesnolte](http://twitter.com/wesnolte)

jQuery OrgChart is a plugin that allows you to render structures with nested elements in a easy-to-read tree structure. To build the tree all you need is to make a single line call to the plugin and supply the HTML element Id for a nested unordered list element that is representative of the data you'd like to display. Features include:

* Very easy to use given a nested unordered list element.
* Showing/hiding a particular branch of the tree by clicking on the respective node.
* Nodes can contain any amount of HTML except `<li>` and `<ul>`.
* Easy to style.

![jQuery OrgChart](http://i.imgur.com/2OpyG.png "jQuery OrgChart")

----

##Expected Markup & Example Usage

To get up and running you'll need a few things. 

-----

###The JavaScript Libraries & CSS

You need to include the jQuery as well as the jOrgChart libraries. For example:

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
	<script src="jquery.jOrgChart.js"></script>
	
The core CSS is necessary to perform some of the basic styling i.e.

    <link rel="stylesheet" href="css/jquery.jOrgChart.css"/>

----

###The HTML

You'll need to construct a nest unordered list that represents your node nesting. For example:

	<ul id="org" style="display:none">
	<li>
	  Food
	  <ul>
	    <li>Beer</li>
	    <li>Vegetables
	      <ul>
	        <li>Pumpkin</li>
	        <li><a href="http://tquila.com" target="_blank">Aubergine</a></li>
	      </ul>
	    </li>
	    <li>Bread</li>
	    <li>Chocolate
	      <ul>
	        <li>Topdeck</li>
	        <li>Reese's Cups</li>
	      </ul>
	    </li>
	  </ul>
	</li>
	</ul>

*Note that you can include any amount of HTML markup in your `<li>` **except** for other `<ul>` or `<li>` elements.*


-----

###The jQuery Call

And the cherry on the top is the usual call, often but not always on document load. You'll need to specify the Id of the list in this call. For example:

	jQuery(document).ready(function() {
	    $("#org").jOrgChart();
	});
	
This call will append the markup for the OrgChart to the `<body>` element by default, but you can specify this as part of the options.

----

##Demo

You can view a demo of this [here](http://dl.dropbox.com/u/4151695/html/jOrgChart/example/example.html "jQuery OrgChart").

------

##Sourcecode

Source code with an example is available [here](https://github.com/wesnolte/jOrgChart/tree/master/example "Example & Source").

-----

##Configuration

There are only 3 configuration options.

1. **chartElement** - used to specify which HTML element you'd like to append the OrgChart markup to. *[default='body']*
2. **depth** - tells the code what depth to parse to. The default value of "-1" instructs it to parse like it's 1999. *[default=-1]*
3. **chartClass** - the name of the style class that is assigned to the generated markup. *[default='jOrgChart']*
